/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Send, CreditCard, Link as LinkIcon, 
  ShieldCheck, Check, Copy, Plus, RefreshCw, AlertCircle, Database, 
  Code, Clock, Lock, Unlock, Info, X, ExternalLink, FileText, CheckCircle2, ChevronRight, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WalletRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  account_number: string;
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'frozen';
  created_at?: string;
}

interface TransactionRecord {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'deposit' | 'transfer_out' | 'transfer_in' | 'donation' | 'payment';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  recipient_account?: string;
  recipient_name?: string;
  reference_no: string;
  created_at: string;
}

interface CardRecord {
  id: string;
  wallet_id: string;
  card_holder: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  card_type: 'Visa' | 'Mastercard' | 'UnionPay';
  status: 'active' | 'frozen' | 'cancelled';
  monthly_limit: number;
}

interface PaymentLinkRecord {
  id: string;
  creator_wallet_id: string;
  title: string;
  description?: string;
  amount: number | null;
  active: boolean;
  created_at: string;
}

interface SupaPayDashboardProps {
  lang: 'en' | 'ur';
}

export default function SupaPayDashboard({ lang }: SupaPayDashboardProps) {
  const isUrdu = lang === 'ur';

  // --- Core States ---
  const [wallet, setWallet] = useState<WalletRecord | null>(null);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [cards, setCards] = useState<CardRecord[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkRecord[]>([]);
  
  // --- UI Control States ---
  const [isLive, setIsLive] = useState<boolean | null>(null); // null = checking, true = Supabase live, false = Local fallback
  const [activeTab, setActiveTab] = useState<'overview' | 'transfer' | 'cards' | 'links' | 'sql'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- Input Forms States ---
  const [transferForm, setTransferForm] = useState({
    recipientAccount: '',
    recipientName: '',
    amount: '',
    description: ''
  });
  const [cardForm, setCardForm] = useState({
    cardHolder: '',
    cardType: 'Visa' as 'Visa' | 'Mastercard' | 'UnionPay',
    limit: '50000'
  });
  const [linkForm, setLinkForm] = useState({
    title: '',
    description: '',
    amount: ''
  });

  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);

  // --- SQL Script String for Copying ---
  const sqlScript = `-- ====================================================================
-- SUPAPAY DATABASE INITIALIZATION SCRIPT FOR SUPABASE
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ====================================================================

-- Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WALLETS TABLE (Stores account credentials, user information, and balances)
CREATE TABLE IF NOT EXISTS supapay_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    account_number VARCHAR(12) UNIQUE NOT NULL, -- Format: 1000100XXXXX
    balance NUMERIC(15, 2) NOT NULL DEFAULT 50000.00, -- Seed with default amount for test preview
    currency VARCHAR(5) NOT NULL DEFAULT 'PKR',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'frozen')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for wallets
ALTER TABLE supapay_wallets ENABLE ROW LEVEL SECURITY;

-- Create public read/write policies (adjust according to production needs)
CREATE POLICY "Allow public read/write on wallets" 
ON supapay_wallets FOR ALL 
USING (true) 
WITH CHECK (true);


-- 2. TRANSACTIONS TABLE (Logs all incoming/outgoing transfers, deposits, and bill payments)
CREATE TABLE IF NOT EXISTS supapay_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES supapay_wallets(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('deposit', 'transfer_out', 'transfer_in', 'donation', 'payment')),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    recipient_account VARCHAR(12),
    recipient_name VARCHAR(100),
    reference_no VARCHAR(16) UNIQUE NOT NULL, -- Auto-generated unique txn reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for transactions
ALTER TABLE supapay_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on transactions" 
ON supapay_transactions FOR ALL 
USING (true) 
WITH CHECK (true);


-- 3. VIRTUAL CARDS TABLE (Enables managing cards linked directly to wallets)
CREATE TABLE IF NOT EXISTS supapay_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES supapay_wallets(id) ON DELETE CASCADE,
    card_holder VARCHAR(100) NOT NULL,
    card_number VARCHAR(19) UNIQUE NOT NULL, -- Format: 4111-XXXX-XXXX-XXXX
    expiry_date VARCHAR(5) NOT NULL, -- Format: MM/YY
    cvv VARCHAR(3) NOT NULL,
    card_type VARCHAR(20) NOT NULL DEFAULT 'Visa' CHECK (card_type IN ('Visa', 'Mastercard', 'UnionPay')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled')),
    monthly_limit NUMERIC(15, 2) DEFAULT 50000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for cards
ALTER TABLE supapay_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on cards" 
ON supapay_cards FOR ALL 
USING (true) 
WITH CHECK (true);


-- 4. PAYMENT LINKS TABLE (Allows creating shareable URLs for receiving payments/donations)
CREATE TABLE IF NOT EXISTS supapay_payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_wallet_id UUID NOT NULL REFERENCES supapay_wallets(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    amount NUMERIC(15, 2), -- NULL means custom user-defined amount on checkout
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for payment links
ALTER TABLE supapay_payment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on payment_links" 
ON supapay_payment_links FOR ALL 
USING (true) 
WITH CHECK (true);


-- ====================================================================
-- SEED DATA (Creates a sample wallet and history to instantly demo the dashboard)
-- ====================================================================

-- Insert sample wallet if it doesn't already exist
INSERT INTO supapay_wallets (id, full_name, email, phone, account_number, balance, currency, status)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 
    'Khalifa Salman Ali Qadri', 
    'salmanali2204134@gmail.com', 
    '03152204134', 
    '100010023456', 
    145820.00, 
    'PKR', 
    'active'
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample transactions for sample wallet
INSERT INTO supapay_transactions (wallet_id, amount, type, description, status, recipient_account, recipient_name, reference_no)
VALUES 
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    25000.00,
    'deposit',
    'Bank Transfer deposit from Habib Bank (HBL)',
    'completed',
    NULL,
    NULL,
    'TXN98231221'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    15000.00,
    'transfer_out',
    'Sent to Al-Khidmat Foundation (Ramadan Relief)',
    'completed',
    '100010044556',
    'Al-Khidmat Foundation',
    'TXN55219082'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    50000.00,
    'transfer_in',
    'Received transfer from Bilal Ahmed (Brother)',
    'completed',
    '100010099887',
    'Bilal Ahmed',
    'TXN88329107'
)
ON CONFLICT (reference_no) DO NOTHING;

-- Insert sample Visa card for wallet
INSERT INTO supapay_cards (wallet_id, card_holder, card_number, expiry_date, cvv, card_type, status, monthly_limit)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'SALMAN ALI QADRI',
    '4111-5832-9012-4456',
    '12/29',
    '382',
    'Visa',
    'active',
    100000.00
)
ON CONFLICT (card_number) DO NOTHING;`;

  // --- Initial Data Load & Supabase Verification ---
  const loadDashboardData = async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // 1. Verify connection and check if table 'supapay_wallets' exists
      const { data: walletsData, error: walletsError } = await supabase
        .from('supapay_wallets')
        .select('*')
        .limit(1);

      if (walletsError) {
        // Table doesn't exist yet, fall back to localStorage
        console.log("Supabase connection failed or tables do not exist. Falling back to local data store:", walletsError.message);
        setIsLive(false);
        loadLocalData();
      } else if (walletsData && walletsData.length > 0) {
        // Active wallet found on Supabase! Load all associated live records.
        setIsLive(true);
        const activeWallet = walletsData[0] as WalletRecord;
        setWallet(activeWallet);

        // Fetch Transactions
        const { data: txs, error: txError } = await supabase
          .from('supapay_transactions')
          .select('*')
          .eq('wallet_id', activeWallet.id)
          .order('created_at', { ascending: false });
        if (!txError && txs) setTransactions(txs as TransactionRecord[]);

        // Fetch Cards
        const { data: crds, error: crdError } = await supabase
          .from('supapay_cards')
          .select('*')
          .eq('wallet_id', activeWallet.id);
        if (!crdError && crds) setCards(crds as CardRecord[]);

        // Fetch Payment Links
        const { data: lnks, error: lnkError } = await supabase
          .from('supapay_payment_links')
          .select('*')
          .eq('creator_wallet_id', activeWallet.id);
        if (!lnkError && lnks) setPaymentLinks(lnks as PaymentLinkRecord[]);

      } else {
        // Table exists but is completely empty (no seed done yet). Initialize one default wallet record on Supabase!
        setIsLive(true);
        const defaultWallet: Omit<WalletRecord, 'id'> = {
          full_name: "Khalifa Salman Ali Qadri",
          email: "salmanali2204134@gmail.com",
          phone: "03152204134",
          account_number: "100010023456",
          balance: 145820.00,
          currency: "PKR",
          status: "active"
        };

        const { data: newWallets, error: insertError } = await supabase
          .from('supapay_wallets')
          .insert([defaultWallet])
          .select();

        if (!insertError && newWallets && newWallets.length > 0) {
          const activeWallet = newWallets[0] as WalletRecord;
          setWallet(activeWallet);
          
          // Seed initial transactions
          const defaultTxs = [
            { wallet_id: activeWallet.id, amount: 25000.00, type: 'deposit', description: 'Habib Bank (HBL) Direct Deposit', status: 'completed', reference_no: 'TXN98231221', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
            { wallet_id: activeWallet.id, amount: 15000.00, type: 'transfer_out', description: 'Sent to Al-Khidmat Foundation (Ramadan Relief)', status: 'completed', recipient_account: '100010044556', recipient_name: 'Al-Khidmat Foundation', reference_no: 'TXN55219082', created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
            { wallet_id: activeWallet.id, amount: 50000.00, type: 'transfer_in', description: 'Received transfer from Bilal Ahmed (Brother)', status: 'completed', recipient_account: '100010099887', recipient_name: 'Bilal Ahmed', reference_no: 'TXN88329107', created_at: new Date().toISOString() }
          ];
          await supabase.from('supapay_transactions').insert(defaultTxs);
          setTransactions(defaultTxs as any);

          // Seed Initial Card
          const defaultCard = { wallet_id: activeWallet.id, card_holder: 'SALMAN ALI QADRI', card_number: '4111-5832-9012-4456', expiry_date: '12/29', cvv: '382', card_type: 'Visa', status: 'active', monthly_limit: 100000.00 };
          await supabase.from('supapay_cards').insert([defaultCard]);
          setCards([defaultCard] as any);
        } else {
          loadLocalData();
        }
      }
    } catch (err) {
      console.warn("Unexpected connection issue. Loading local engine:", err);
      setIsLive(false);
      loadLocalData();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // --- Local Offline LocalStorage Fallback Handler ---
  const loadLocalData = () => {
    // Wallet
    const localWallet = localStorage.getItem('supapay_wallet');
    if (localWallet) {
      setWallet(JSON.parse(localWallet));
    } else {
      const defaultWallet: WalletRecord = {
        id: "local-wallet-id-9988",
        full_name: "Khalifa Salman Ali Qadri",
        email: "salmanali2204134@gmail.com",
        phone: "03152204134",
        account_number: "100010023456",
        balance: 145820.00,
        currency: "PKR",
        status: "active"
      };
      setWallet(defaultWallet);
      localStorage.setItem('supapay_wallet', JSON.stringify(defaultWallet));
    }

    // Transactions
    const localTxs = localStorage.getItem('supapay_transactions');
    if (localTxs) {
      setTransactions(JSON.parse(localTxs));
    } else {
      const defaultTxs: TransactionRecord[] = [
        {
          id: "tx-1",
          wallet_id: "local-wallet-id-9988",
          amount: 25000.00,
          type: 'deposit',
          description: 'Habib Bank (HBL) Direct Deposit',
          status: 'completed',
          reference_no: 'TXN98231221',
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: "tx-2",
          wallet_id: "local-wallet-id-9988",
          amount: 15000.00,
          type: 'transfer_out',
          description: 'Sent to Al-Khidmat Foundation (Ramadan Relief)',
          status: 'completed',
          recipient_account: '100010044556',
          recipient_name: 'Al-Khidmat Foundation',
          reference_no: 'TXN55219082',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString()
        },
        {
          id: "tx-3",
          wallet_id: "local-wallet-id-9988",
          amount: 50000.00,
          type: 'transfer_in',
          description: 'Received transfer from Bilal Ahmed (Brother)',
          status: 'completed',
          recipient_account: '100010099887',
          recipient_name: 'Bilal Ahmed',
          reference_no: 'TXN88329107',
          created_at: new Date().toISOString()
        }
      ];
      setTransactions(defaultTxs);
      localStorage.setItem('supapay_transactions', JSON.stringify(defaultTxs));
    }

    // Cards
    const localCards = localStorage.getItem('supapay_cards');
    if (localCards) {
      setCards(JSON.parse(localCards));
    } else {
      const defaultCards: CardRecord[] = [
        {
          id: "card-1",
          wallet_id: "local-wallet-id-9988",
          card_holder: 'SALMAN ALI QADRI',
          card_number: '4111-5832-9012-4456',
          expiry_date: '12/29',
          cvv: '382',
          card_type: 'Visa',
          status: 'active',
          monthly_limit: 100000.00
        }
      ];
      setCards(defaultCards);
      localStorage.setItem('supapay_cards', JSON.stringify(defaultCards));
    }

    // Payment Links
    const localLinks = localStorage.getItem('supapay_links');
    if (localLinks) {
      setPaymentLinks(JSON.parse(localLinks));
    } else {
      const defaultLinks: PaymentLinkRecord[] = [
        {
          id: "link-1",
          creator_wallet_id: "local-wallet-id-9988",
          title: "Zakat & Zairain Donation",
          description: "General support for Surjani Water filtration system operations and maintenance",
          amount: 2500.00,
          active: true,
          created_at: new Date().toISOString()
        },
        {
          id: "link-2",
          creator_wallet_id: "local-wallet-id-9988",
          title: "Food Drive Support",
          description: "Contribution towards the daily Hasnain Foundation Karachi Food Drives",
          amount: null, // custom user input
          active: true,
          created_at: new Date().toISOString()
        }
      ];
      setPaymentLinks(defaultLinks);
      localStorage.setItem('supapay_links', JSON.stringify(defaultLinks));
    }
  };

  // --- Run Load on Mount ---
  useEffect(() => {
    loadDashboardData();
  }, []);

  // --- Copy Clipboard Helper ---
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // --- Execute Transfer ---
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    const amt = parseFloat(transferForm.amount);
    if (isNaN(amt) || amt <= 0) {
      showFeedback('error', isUrdu ? 'برائے مہربانی درست رقم درج کریں' : 'Please enter a valid transfer amount.');
      return;
    }

    if (wallet.balance < amt) {
      showFeedback('error', isUrdu ? 'آپ کے اکاؤنٹ میں ناکافی فنڈز ہیں' : 'Insufficient funds in your SupaPay wallet.');
      return;
    }

    if (!transferForm.recipientAccount || !transferForm.recipientName) {
      showFeedback('error', isUrdu ? 'تمام مطلوبہ خانے پُر کریں' : 'Please enter both the recipient account number and full name.');
      return;
    }

    setIsRefreshing(true);
    const updatedBalance = Number(wallet.balance) - amt;
    const refNo = 'TXN' + Math.floor(10000000 + Math.random() * 90000000);

    const newTx: Omit<TransactionRecord, 'id'> = {
      wallet_id: wallet.id,
      amount: amt,
      type: 'transfer_out',
      description: transferForm.description || `Transfer to ${transferForm.recipientName}`,
      status: 'completed',
      recipient_account: transferForm.recipientAccount,
      recipient_name: transferForm.recipientName,
      reference_no: refNo,
      created_at: new Date().toISOString()
    };

    if (isLive) {
      try {
        // Update wallet balance on Supabase
        const { error: walletErr } = await supabase
          .from('supapay_wallets')
          .update({ balance: updatedBalance })
          .eq('id', wallet.id);

        if (walletErr) throw walletErr;

        // Insert new transaction record
        const { error: txErr } = await supabase
          .from('supapay_transactions')
          .insert([newTx]);

        if (txErr) throw txErr;

        // Refresh live data
        loadDashboardData(true);
        showFeedback('success', isUrdu ? 'رقم کامیابی سے منتقل ہو گئی ہے!' : 'Funds transferred successfully!');
      } catch (err: any) {
        showFeedback('error', `Database error: ${err.message}`);
      }
    } else {
      // Local fallback execution
      const updatedWallet: WalletRecord = { ...wallet, balance: updatedBalance };
      const localTx: TransactionRecord = { ...newTx, id: 'tx-' + Date.now() };
      const updatedTxs = [localTx, ...transactions];

      setWallet(updatedWallet);
      setTransactions(updatedTxs);

      localStorage.setItem('supapay_wallet', JSON.stringify(updatedWallet));
      localStorage.setItem('supapay_transactions', JSON.stringify(updatedTxs));

      setIsRefreshing(false);
      showFeedback('success', isUrdu ? 'رقم کامیابی سے منتقل ہو گئی ہے! (مقامی طور پر محفوظ)' : 'Funds transferred successfully! (Saved locally)');
    }

    // Reset Form
    setTransferForm({
      recipientAccount: '',
      recipientName: '',
      amount: '',
      description: ''
    });
  };

  // --- Add Virtual Card ---
  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    if (!cardForm.cardHolder) {
      showFeedback('error', isUrdu ? 'کارڈ ہولڈر کا نام درج کریں' : 'Please enter the cardholder name.');
      return;
    }

    setIsRefreshing(true);
    const cardLimit = parseFloat(cardForm.limit) || 50000;
    // Generate mock card number: 4111-XXXX-XXXX-XXXX
    const generateNum = () => {
      const part = () => Math.floor(1000 + Math.random() * 9000).toString();
      return `4111-${part()}-${part()}-${part()}`;
    };
    const newCardNo = generateNum();
    const expiry = `12/${new Date().getFullYear() % 100 + 4}`;
    const cvv = Math.floor(100 + Math.random() * 900).toString();

    const newCard: Omit<CardRecord, 'id'> = {
      wallet_id: wallet.id,
      card_holder: cardForm.cardHolder.toUpperCase(),
      card_number: newCardNo,
      expiry_date: expiry,
      cvv,
      card_type: cardForm.cardType,
      status: 'active',
      monthly_limit: cardLimit
    };

    if (isLive) {
      try {
        const { error } = await supabase
          .from('supapay_cards')
          .insert([newCard]);
        if (error) throw error;
        loadDashboardData(true);
        showFeedback('success', isUrdu ? 'ورچوئل کارڈ کامیابی سے تخلیق ہو گیا!' : 'Virtual card issued successfully!');
      } catch (err: any) {
        showFeedback('error', `Database error: ${err.message}`);
      }
    } else {
      const localCard: CardRecord = { ...newCard, id: 'card-' + Date.now() };
      const updatedCards = [...cards, localCard];
      setCards(updatedCards);
      localStorage.setItem('supapay_cards', JSON.stringify(updatedCards));
      setIsRefreshing(false);
      showFeedback('success', isUrdu ? 'ورچوئل کارڈ کامیابی سے تخلیق ہو گیا! (مقامی محفوظ)' : 'Virtual card issued successfully! (Saved locally)');
    }

    setShowAddCard(false);
    setCardForm({ cardHolder: '', cardType: 'Visa', limit: '50000' });
  };

  // --- Add Payment Request Link ---
  const handleAddLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;

    if (!linkForm.title) {
      showFeedback('error', isUrdu ? 'لنک کا عنوان درج کریں' : 'Please enter the payment link title.');
      return;
    }

    setIsRefreshing(true);
    const linkAmount = linkForm.amount ? parseFloat(linkForm.amount) : null;

    const newLink: Omit<PaymentLinkRecord, 'id'> = {
      creator_wallet_id: wallet.id,
      title: linkForm.title,
      description: linkForm.description || '',
      amount: linkAmount,
      active: true,
      created_at: new Date().toISOString()
    };

    if (isLive) {
      try {
        const { error } = await supabase
          .from('supapay_payment_links')
          .insert([newLink]);
        if (error) throw error;
        loadDashboardData(true);
        showFeedback('success', isUrdu ? 'ادائیگی کا لنک کامیابی سے بن گیا!' : 'Payment Link created successfully!');
      } catch (err: any) {
        showFeedback('error', `Database error: ${err.message}`);
      }
    } else {
      const localLink: PaymentLinkRecord = { ...newLink, id: 'link-' + Date.now() };
      const updatedLinks = [...paymentLinks, localLink];
      setPaymentLinks(updatedLinks);
      localStorage.setItem('supapay_links', JSON.stringify(updatedLinks));
      setIsRefreshing(false);
      showFeedback('success', isUrdu ? 'ادائیگی کا لنک کامیابی سے بن گیا! (مقامی محفوظ)' : 'Payment Link created successfully! (Saved locally)');
    }

    setShowAddLink(false);
    setLinkForm({ title: '', description: '', amount: '' });
  };

  // --- Freeze/Unfreeze Virtual Card ---
  const toggleCardStatus = async (cardId: string, currentStatus: 'active' | 'frozen') => {
    setIsRefreshing(true);
    const newStatus = currentStatus === 'active' ? 'frozen' : 'active';

    if (isLive) {
      try {
        const { error } = await supabase
          .from('supapay_cards')
          .update({ status: newStatus })
          .eq('id', cardId);
        if (error) throw error;
        loadDashboardData(true);
        showFeedback('success', `Card ${newStatus === 'frozen' ? 'frozen' : 'activated'}!`);
      } catch (err: any) {
        showFeedback('error', `Database error: ${err.message}`);
      }
    } else {
      const updatedCards = cards.map(c => c.id === cardId ? { ...c, status: newStatus as any } : c);
      setCards(updatedCards);
      localStorage.setItem('supapay_cards', JSON.stringify(updatedCards));
      setIsRefreshing(false);
      showFeedback('success', `Card ${newStatus === 'frozen' ? 'frozen' : 'activated'}! (Saved locally)`);
    }
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12" id="supapay-dashboard-section">
      
      {/* Upper Status Notifications */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3.5 rounded-2xl shadow-xl border text-sm max-w-md ${
              feedbackMsg.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold">{feedbackMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Card */}
      <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden mb-10">
        {/* Abstract background vector accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-emerald-500/20 text-emerald-400 flex items-center gap-1 uppercase">
                <ShieldCheck className="w-3 h-3" />
                {isLive ? 'Supabase Connected' : 'Sandbox Demo Mode'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
              Supa<span className="text-emerald-500">Pay</span> Dashboard
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
              {isUrdu 
                ? 'حسنین فاؤنڈیشن کے ڈیجیٹل عطیات، والٹ اکاؤنٹ، فنڈ ٹرانسفر، ورچوئل پیمنٹ کارڈز اور سپابیس پراجیکٹ کا براہِ راست کنٹرول پینل۔'
                : 'Manage real-time digital Zakat/charity accounts, instant wallet transfers, virtual debit cards, and shareable checkout payment links linked directly to your Supabase cloud.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer bg-slate-800/50 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? (isUrdu ? 'اپ ڈیٹ ہو رہا ہے...' : 'Syncing...') : (isUrdu ? 'تازہ کریں' : 'Refresh Data')}</span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-600/10"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ایس کیو ایل اسکرپٹ' : 'Copy Database SQL'}</span>
            </button>
          </div>
        </div>

        {/* Database Warning Banner if offline */}
        {!isLive && isLive !== null && (
          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-amber-200 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-grow">
              <span className="font-bold">{isUrdu ? 'نوٹ:' : 'Setup Prompt:'}</span> {isUrdu 
                ? 'آپ کا سپا بیس والٹ فی الحال لوکل سٹوریج پر چل رہا ہے۔ براہ کرم ڈیٹا بیس سے لنک کرنے کے لیے SQL اسکرپٹ چلائیں۔'
                : 'SupaPay local engine is running. To connect your live Supabase database, switch to the "SQL Database Setup" tab, copy the script, and run it in your Supabase SQL editor.'}
            </div>
            <button 
              onClick={() => setActiveTab('sql')} 
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white rounded-lg transition-all font-bold text-[11px] cursor-pointer"
            >
              {isUrdu ? 'سیٹ اپ کیجئے' : 'View Setup SQL'}
            </button>
          </div>
        )}
      </div>

      {/* Main Layout Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation Links & Active Card */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Quick Wallet Stats Widget */}
          {wallet && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-1">
                {isUrdu ? 'والٹ اکاؤنٹ بیلنس' : 'Wallet Total Balance'}
              </span>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-slate-500 font-sans">{wallet.currency}</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                <div className="flex justify-between">
                  <span>{isUrdu ? 'اکاؤنٹ نمبر:' : 'Account No:'}</span>
                  <span className="font-bold text-slate-700">{wallet.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isUrdu ? 'والٹ اکاؤنٹ ہولڈر:' : 'Account Holder:'}</span>
                  <span className="font-bold text-slate-700">{wallet.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isUrdu ? 'اسٹیٹس:' : 'Status:'}</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {wallet.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Vertical Navigation Controls */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all duration-150 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row font-sans'}`}
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span className="flex-grow">{isUrdu ? 'والٹ جائزہ اور ریکارڈ' : 'Overview & History'}</span>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setActiveTab('transfer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all duration-150 cursor-pointer ${
                activeTab === 'transfer'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row font-sans'}`}
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span className="flex-grow">{isUrdu ? 'رقم منتقل کریں' : 'Transfer & Send Funds'}</span>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all duration-150 cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row font-sans'}`}
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span className="flex-grow">{isUrdu ? 'ورچوئل کارڈز' : 'Virtual Debit Cards'}</span>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setActiveTab('links')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all duration-150 cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row font-sans'}`}
            >
              <LinkIcon className="w-4 h-4 text-emerald-600" />
              <span className="flex-grow">{isUrdu ? 'ادائیگی کے لنکس' : 'Payment Links'}</span>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all duration-150 cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
              } ${isUrdu ? 'flex-row-reverse text-right font-urdu' : 'flex-row font-sans'}`}
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="flex-grow">{isUrdu ? 'ایس کیو ایل ڈیٹا بیس لنک' : 'SQL Database Setup'}</span>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Side: Active Workspace Card based on tab */}
        <div className="lg:col-span-9">
          
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
              <p className="text-slate-500 font-sans text-sm font-bold">
                {isUrdu ? 'لوڈ ہو رہا ہے...' : 'Syncing with Supabase API hooks...'}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* TAB 1: OVERVIEW & TRANSACTION FEED */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-emerald-600 font-bold text-xs tracking-wider uppercase block mb-1">
                            {isUrdu ? 'خوش آمدید والٹ ہولڈر' : 'Welcome Account Holder'}
                          </span>
                          <h2 className="text-2xl font-bold text-slate-800 font-sans">
                            {wallet?.full_name || "Khalifa Salman Ali"}
                          </h2>
                          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-sans">
                            {isUrdu ? 'اپنا عطیہ ریکارڈ اور آن لائن ٹرانزیکشنز کی تفصیلات ذیل میں دیکھیں۔' : 'Review your transactions log, deposits, transfers and virtual card transactions below.'}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveTab('transfer')}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-xs cursor-pointer shadow-sm shadow-slate-950/10"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isUrdu ? 'ٹرانسفر' : 'Send Funds'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Transaction History Block */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-base font-sans">
                            {isUrdu ? 'ٹرانزیکشن ہسٹری' : 'Real-time Transactions Log'}
                          </h3>
                          <p className="text-xs text-slate-500 font-sans mt-0.5">
                            {isUrdu ? 'تمام آنے والے اور آؤٹ گوئنگ والٹ ٹرانزیکشنز' : 'Showing latest incoming and outgoing wallet transfers'}
                          </p>
                        </div>

                        <span className="px-2.5 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 font-mono">
                          {transactions.length} Total
                        </span>
                      </div>

                      {transactions.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-sans text-sm">
                          {isUrdu ? 'کوئی ٹرانزیکشنز نہیں پائی گئیں۔' : 'No transactions recorded on this account.'}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {transactions.map((tx) => {
                            const isTransferOut = tx.type === 'transfer_out' || tx.type === 'payment';
                            return (
                              <div 
                                key={tx.id} 
                                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                              >
                                <div className="flex items-center gap-3.5">
                                  {/* Icon container based on type */}
                                  <div className={`p-2.5 rounded-xl ${
                                    isTransferOut 
                                      ? 'bg-amber-50 text-amber-600' 
                                      : tx.type === 'deposit' 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    {isTransferOut ? (
                                      <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                      <ArrowDownLeft className="w-4 h-4" />
                                    )}
                                  </div>

                                  <div>
                                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm font-sans leading-tight">
                                      {tx.description}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[10px] text-slate-400 font-mono">
                                      <span>Ref: {tx.reference_no}</span>
                                      <span>•</span>
                                      <span>{new Date(tx.created_at).toLocaleString()}</span>
                                      {tx.recipient_name && (
                                        <>
                                          <span>•</span>
                                          <span className="text-slate-500 font-sans font-bold">To: {tx.recipient_name}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                  <span className={`text-sm sm:text-base font-extrabold font-mono ${
                                    isTransferOut ? 'text-slate-700' : 'text-emerald-600'
                                  }`}>
                                    {isTransferOut ? '-' : '+'}{tx.amount.toLocaleString()} <span className="text-[10px] font-bold">PKR</span>
                                  </span>
                                  <div className="mt-0.5">
                                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-600">
                                      {tx.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: TRANSFER PORTAL */}
                {activeTab === 'transfer' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <div className="mb-6 pb-4 border-b border-slate-100">
                      <h3 className="text-lg font-extrabold text-slate-800 font-sans">
                        {isUrdu ? 'ڈیجیٹل والٹ فنڈز ٹرانسفر' : 'Send & Transfer Funds'}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1 font-sans">
                        {isUrdu ? 'کسی بھی دوسرے سپا پے اکاؤنٹ نمبر پر فوری طور پر فنڈز منتقل کریں۔' : 'Instantly transfer money from your active wallet balance to another account number.'}
                      </p>
                    </div>

                    <form onSubmit={handleTransferSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 font-sans">
                            {isUrdu ? 'وصول کنندہ کا اکاؤنٹ نمبر *' : 'Recipient Account Number *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 100010044556"
                            value={transferForm.recipientAccount}
                            onChange={(e) => setTransferForm({ ...transferForm, recipientAccount: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 font-sans">
                            {isUrdu ? 'وصول کنندہ کا پورا نام *' : 'Recipient Full Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Al-Khidmat Foundation"
                            value={transferForm.recipientName}
                            onChange={(e) => setTransferForm({ ...transferForm, recipientName: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                          />
                        </div>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 font-sans">
                            {isUrdu ? 'ٹرانسفر رقم (PKR) *' : 'Amount to Transfer (PKR) *'}
                          </label>
                          <input
                            type="number"
                            required
                            min="10"
                            placeholder="e.g. 15000"
                            value={transferForm.amount}
                            onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 font-sans">
                            {isUrdu ? 'ٹرانزیکشن کا مقصد / ریمارکس' : 'Description / Memo'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Zakat contribution, Ramadan donation"
                            value={transferForm.description}
                            onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                          />
                        </div>

                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={isRefreshing}
                          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm cursor-pointer disabled:opacity-50 transition-colors shadow-lg shadow-emerald-600/10"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isRefreshing ? (isUrdu ? 'منتقل ہو رہا ہے...' : 'Sending...') : (isUrdu ? 'رقم بھیجیں' : 'Confirm & Transfer Funds')}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 3: VIRTUAL DEBIT CARDS */}
                {activeTab === 'cards' && (
                  <div className="space-y-6">
                    
                    {/* Header bar and action */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-800 font-sans">
                          {isUrdu ? 'ورچوئل پے منٹ کارڈز' : 'Virtual Debit & Payment Cards'}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-sans">
                          {isUrdu ? 'محفوظ آن لائن خریداریوں اور عطیات کے لیے عارضی یا طویل مدتی والٹ کارڈز بنائیں۔' : 'Create instant virtual Visa or Mastercard debit cards connected to your wallet balance.'}
                        </p>
                      </div>

                      <button
                        onClick={() => setShowAddCard(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 font-bold text-xs cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isUrdu ? 'نیا ورچوئل کارڈ' : 'Issue Virtual Card'}</span>
                      </button>
                    </div>

                    {/* Add Virtual Card Modal Form Overlay */}
                    <AnimatePresence>
                      {showAddCard && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100"
                          >
                            <button
                              onClick={() => setShowAddCard(false)}
                              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-lg font-extrabold text-slate-800 font-sans mb-4">
                              {isUrdu ? 'نیا ورچوئل کارڈ حاصل کریں' : 'Issue New Virtual Debit Card'}
                            </h3>

                            <form onSubmit={handleAddCardSubmit} className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                  {isUrdu ? 'کارڈ ہولڈر کا نام *' : 'Cardholder Full Name *'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. KHALIFA SALMAN ALI"
                                  value={cardForm.cardHolder}
                                  onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 text-sm uppercase"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                    {isUrdu ? 'کارڈ پرووائیڈر' : 'Card Brand'}
                                  </label>
                                  <select
                                    value={cardForm.cardType}
                                    onChange={(e) => setCardForm({ ...cardForm, cardType: e.target.value as any })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 text-sm"
                                  >
                                    <option value="Visa">Visa</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="UnionPay">UnionPay</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                    {isUrdu ? 'ماہانہ حد (PKR)' : 'Monthly Limit (PKR)'}
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={cardForm.limit}
                                    onChange={(e) => setCardForm({ ...cardForm, limit: e.target.value })}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 text-sm"
                                  />
                                </div>
                              </div>

                              <div className="pt-4 flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => setShowAddCard(false)}
                                  className="flex-grow py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer text-center"
                                >
                                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                                </button>
                                <button
                                  type="submit"
                                  className="flex-grow py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer text-center"
                                >
                                  {isUrdu ? 'کارڈ جاری کریں' : 'Issue Active Card'}
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Debit Cards Render Grid */}
                    {cards.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center text-slate-400 text-sm">
                        {isUrdu ? 'فی الحال کوئی ورچوئل کارڈز فعال نہیں ہیں۔' : 'No active virtual debit cards linked to this account.'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cards.map((c) => {
                          const isFrozen = c.status === 'frozen';
                          return (
                            <div 
                              key={c.id} 
                              className={`rounded-3xl border shadow-sm p-6 relative overflow-hidden transition-all duration-300 ${
                                isFrozen 
                                  ? 'bg-slate-50 border-slate-200 opacity-70' 
                                  : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-slate-800 text-white'
                              }`}
                            >
                              {/* Shiny chip and network logo */}
                              <div className="flex justify-between items-start mb-10">
                                <div>
                                  {/* Golden microchip logo */}
                                  <div className="w-10 h-7 bg-amber-400/40 border border-amber-400/30 rounded-md mb-2 flex items-center justify-between px-1.5">
                                    <div className="w-[1px] h-full bg-amber-400/20"></div>
                                    <div className="w-[1px] h-full bg-amber-400/20"></div>
                                    <div className="w-[1px] h-full bg-amber-400/20"></div>
                                  </div>
                                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isFrozen ? 'text-slate-400' : 'text-emerald-400'}`}>
                                    {isFrozen ? 'Card Frozen' : 'Virtual Debit'}
                                  </span>
                                </div>
                                <span className={`text-sm font-black italic tracking-wide uppercase ${isFrozen ? 'text-slate-400' : 'text-slate-200'}`}>
                                  {c.card_type}
                                </span>
                              </div>

                              {/* Card Number */}
                              <div className="mb-8">
                                <div className="flex items-center gap-2.5">
                                  <span className={`text-lg sm:text-xl font-mono tracking-widest font-semibold ${isFrozen ? 'text-slate-500' : 'text-slate-100'}`}>
                                    {c.card_number}
                                  </span>
                                  {!isFrozen && (
                                    <button
                                      onClick={() => handleCopy(c.card_number, c.id + '_no')}
                                      className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                                      title="Copy card number"
                                    >
                                      {copiedText === c.id + '_no' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-4 mt-2.5 text-[10px] font-mono text-slate-400">
                                  <div>
                                    <span className="block text-[8px] uppercase">{isUrdu ? 'میعاد ختم' : 'Expiry'}</span>
                                    <span className="font-bold text-slate-300">{c.expiry_date}</span>
                                  </div>
                                  <div>
                                    <span className="block text-[8px] uppercase">CVV</span>
                                    <span className="font-bold text-slate-300">{c.cvv}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom: Holder and Toggle action */}
                              <div className="flex justify-between items-end pt-4 border-t border-slate-100/10">
                                <div>
                                  <span className="block text-[8px] uppercase text-slate-400 font-sans">{isUrdu ? 'کارڈ ہولڈر' : 'Cardholder'}</span>
                                  <span className={`text-xs font-bold font-mono tracking-wider ${isFrozen ? 'text-slate-600' : 'text-white'}`}>
                                    {c.card_holder}
                                  </span>
                                </div>

                                <button
                                  onClick={() => toggleCardStatus(c.id, c.status as any)}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-[10px] cursor-pointer transition-all ${
                                    isFrozen 
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                                  }`}
                                >
                                  {isFrozen ? (
                                    <>
                                      <Unlock className="w-3 h-3" />
                                      <span>{isUrdu ? 'بحال کریں' : 'Unfreeze Card'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3" />
                                      <span>{isUrdu ? 'فریز کریں' : 'Freeze Card'}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: SHAREABLE PAYMENT LINKS */}
                {activeTab === 'links' && (
                  <div className="space-y-6">
                    
                    {/* Header summary and action */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-800 font-sans">
                          {isUrdu ? 'ادائیگی کے شیئر ایبل لنکس' : 'Shareable Payment checkout Links'}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-sans">
                          {isUrdu ? 'واٹس ایپ، فیس بک یا ای میل پر عطیات جمع کرنے کے لیے براہ راست چیک آؤٹ لنکس بنائیں۔' : 'Create reusable donation & checkout collection links to send to donors over WhatsApp or email.'}
                        </p>
                      </div>

                      <button
                        onClick={() => setShowAddLink(true)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 font-bold text-xs cursor-pointer shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isUrdu ? 'نیا لنک بنائیں' : 'Create Checkout Link'}</span>
                      </button>
                    </div>

                    {/* Add Payment Link Overlay Form Modal */}
                    <AnimatePresence>
                      {showAddLink && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100"
                          >
                            <button
                              onClick={() => setShowAddLink(false)}
                              className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-lg font-extrabold text-slate-800 font-sans mb-4">
                              {isUrdu ? 'نیا ادائیگی لنک بنائیں' : 'Create New Checkout Link'}
                            </h3>

                            <form onSubmit={handleAddLinkSubmit} className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                  {isUrdu ? 'لنک کا عنوان (مہم) *' : 'Link Title (Campaign Name) *'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Daily Ration Bag Distribution"
                                  value={linkForm.title}
                                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                  {isUrdu ? 'مختصر تفصیل' : 'Description'}
                                </label>
                                <textarea
                                  placeholder="e.g. Donate to support our Orangi Town ration drive for widow families."
                                  value={linkForm.description}
                                  onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                                  rows={3}
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 text-sm"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                                  {isUrdu ? 'ادائیگی کی رقم (خالی رکھیں اگر مرضی کی رقم ہو)' : 'Fixed Amount (Leave blank for custom donor inputs)'}
                                </label>
                                <input
                                  type="number"
                                  placeholder="e.g. 3500 (Optional)"
                                  value={linkForm.amount}
                                  onChange={(e) => setLinkForm({ ...linkForm, amount: e.target.value })}
                                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 text-sm"
                                />
                              </div>

                              <div className="pt-4 flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => setShowAddLink(false)}
                                  className="flex-grow py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer text-center"
                                >
                                  {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                                </button>
                                <button
                                  type="submit"
                                  className="flex-grow py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer text-center"
                                >
                                  {isUrdu ? 'لنک بنائیں' : 'Create Payment Link'}
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Checkout Links List render */}
                    {paymentLinks.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center text-slate-400 text-sm">
                        {isUrdu ? 'ابھی تک کوئی چیک آؤٹ لنکس تخلیق نہیں ہوئے ہیں۔' : 'No active donation checkout links created yet.'}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paymentLinks.map((l) => {
                          const checkoutUrl = `${window.location.origin}/checkout?linkId=${l.id}`;
                          return (
                            <div 
                              key={l.id} 
                              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base font-sans">
                                    {l.title}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    Active
                                  </span>
                                </div>
                                {l.description && (
                                  <p className="text-slate-500 text-xs font-sans max-w-xl">
                                    {l.description}
                                  </p>
                                )}
                                <div className="text-[10px] font-mono text-slate-400 pt-1">
                                  <span>{isUrdu ? 'تخلیق شدہ:' : 'Created at:'} {new Date(l.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3.5 flex-shrink-0 md:text-right md:flex-col md:items-end">
                                <div className="text-slate-800 font-sans font-extrabold text-sm sm:text-base">
                                  {l.amount ? (
                                    <span className="font-mono">{l.amount.toLocaleString()} PKR</span>
                                  ) : (
                                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase font-bold">{isUrdu ? 'اپنی مرضی کی رقم' : 'Custom Amount'}</span>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleCopy(checkoutUrl, l.id + '_url')}
                                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all font-bold text-[10px] text-slate-700 cursor-pointer"
                                  >
                                    {copiedText === l.id + '_url' ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span>{isUrdu ? 'کاپی ہو گیا' : 'Copied!'}</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>{isUrdu ? 'لنک کاپی کریں' : 'Copy URL'}</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: SQL DATABASE SETUP INSTRUCTIONS & TERMINAL */}
                {activeTab === 'sql' && (
                  <div className="space-y-6">
                    
                    {/* Setup Guides and Copy Banner */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex-shrink-0">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-800 font-sans">
                            {isUrdu ? 'سپابیس ایس کیو ایل کنکشن گائیڈ' : 'Supabase SQL Cloud Integration Guide'}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed font-sans">
                            {isUrdu 
                              ? 'براہ کرم درج ذیل اسکرپٹ کو کاپی کریں اور اسے اپنے سپا بیس ڈیش بورڈ کے SQL ایڈیٹر میں چلائیں۔ یہ اس سائٹ کے ڈیش بورڈ اور والٹ سسٹم کو آپ کے رئیل ٹائم ڈیٹا بیس کلاؤڈ کے ساتھ جوڑ دے گا۔'
                              : 'Run the optimized SQL initialization script below inside your Supabase project\'s SQL Editor. This will provision all relational tables, types, and seed records to enable real-time cloud data synchronization instantly.'}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-3 text-xs">
                            <a 
                              href="https://supabase.com/dashboard" 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer"
                            >
                              <span>{isUrdu ? 'سپابیس لاگ ان کریں' : 'Go to Supabase Console'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => handleCopy(sqlScript, 'full_sql')}
                              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer"
                            >
                              {copiedText === 'full_sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedText === 'full_sql' ? (isUrdu ? 'کاپی ہو گیا!' : 'SQL Code Copied!') : (isUrdu ? 'مکمل کوڈ کاپی کریں' : 'Copy SQL Script')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Developer Code Terminal Screen */}
                    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                      {/* Terminal Tab Bar */}
                      <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-400 font-mono text-[11px] ml-2">supapay_schema_initialization.sql</span>
                        </div>

                        <button
                          onClick={() => handleCopy(sqlScript, 'terminal_sql')}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {copiedText === 'terminal_sql' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedText === 'terminal_sql' ? (isUrdu ? 'کاپی ہو گیا' : 'Copied!') : (isUrdu ? 'کاپی' : 'Copy Code')}</span>
                        </button>
                      </div>

                      {/* Code Block */}
                      <div className="p-5 overflow-x-auto max-h-[400px] overflow-y-auto">
                        <pre className="font-mono text-[11px] sm:text-xs text-slate-300 leading-relaxed text-left">
                          <code>{sqlScript}</code>
                        </pre>
                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          )}

        </div>

      </div>

    </div>
  );
}
