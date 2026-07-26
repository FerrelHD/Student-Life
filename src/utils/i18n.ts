import { LanguageType } from '../types';

export const i18n = {
  id: {
    // Bottom Nav & Header
    dashboard: 'Dashboard',
    missions: 'Misi',
    vault: 'Brankas',
    agenda: 'Agenda',
    profile: 'Profil',
    greeting: 'Halo',
    activeToday: '{count} Misi Aktif',
    financialTracker: 'Pencatat Keuangan',
    academicSchedule: 'Jadwal Akademik',

    // Dashboard
    nextReward: 'Hadiah Berikutnya: Mastery Badge Level {level}',
    xpUntilNext: '{xp} XP lagi ke level berikutnya',
    nextDeadline: 'Tenggat Berikutnya',
    studyStreak: 'Streak Belajar',
    tapToIncrement: 'Klik untuk tambah streak! 🔥',
    days: 'Hari',
    hours: 'j',
    minutes: 'm',
    monthlyBudget: 'Anggaran Bulanan',
    budgetLeft: 'sisa',
    recentAchievements: 'Pencapaian Terbaru',
    seeAll: 'Lihat Semua',

    // Missions
    weeklyGoal: 'TARGET MINGGUAN',
    finishMissions: 'Selesaikan Misi Akademik',
    completedOf: '{completed} dari {total} selesai',
    activeMissions: 'Misi Aktif',
    pending: 'Tertunda',
    urgent: 'DARURAT',
    normal: 'NORMAL',
    later: 'NANTI',
    extraXpOpportunities: 'Peluang XP Tambahan',
    dailyQuiz: 'Kuis Harian',
    startQuiz: '+50 XP • Mulai Kuis',
    streakBonus: 'Streak 5-Hari',
    claimBonus: 'Klaim Bonus +100 XP',
    searchMissions: 'Cari misi...',

    // Vault
    totalBalance: 'Total Saldo Keuangan',
    addMoney: 'Tambah Saldo',
    weeklyBurn: 'Pengeluaran Mingguan',
    thisWeek: 'Minggu Ini',
    savingsGoal: 'Target Tabungan',
    manageGoal: 'Kelola Target ⚙️',
    recentTransactions: 'Transaksi Terbaru',
    transactionsCount: '{count} Transaksi',
    almostThere: 'Sedikit lagi tercapai! 🚀',
    tapToDeposit: 'Klik untuk Setor / Edit',

    // Agenda
    scheduleFor: 'JADWAL UNTUK',
    events: 'Kegiatan',
    noEvents: 'Tidak ada jadwal untuk tanggal ini.',
    addEvent: 'Tambah Kegiatan',

    // Hero Profile
    editProfile: 'Edit Profil',
    editProfileDetails: 'Edit Detail Profil',
    updateProfileDesc: 'Ubah nama, avatar & jurusan',
    heroicBadges: 'Badge Pencapaian',
    systemConfig: 'Pengaturan Sistem',
    appLanguage: 'Bahasa Aplikasi',
    switchLanguage: 'Bahasa Indonesia & English',
    darkMode: 'Mode Gelap (Dark Mode)',
    darkModeDesc: 'Kurangi kelelahan mata',
    notifications: 'Notifikasi Akademik',
    notificationsDesc: 'Pengingat tugas & tenggat',
    signOut: 'Keluar Akun',

    // Modals
    // Add Mission
    createNewMission: 'Buat Misi Baru',
    missionTitle: 'JUDUL MISI',
    courseModule: 'MATA KULIAH / MODUL',
    priority: 'PRIORITAS',
    highPriority: 'Prioritas Tinggi',
    mediumPriority: 'Prioritas Sedang',
    lowPriority: 'Prioritas Rendah',
    tag: 'TAG / KATEGORI',
    dueTimeframe: 'TENGGAT WAKTU',
    xpReward: 'HADIAH XP',
    cancel: 'Batal',
    addMissionBtn: 'Tambah Misi',

    // Add Transaction
    addDepositCredit: 'Tambah Pemasukan Saldo',
    logExpense: 'Catat Pengeluaran',
    depositTab: '+ Pemasukan',
    expenseTab: '- Pengeluaran',
    description: 'KETERANGAN TRANSAKSI',
    amountRp: 'NOMINAL (RP)',
    categoryLabel: 'KATEGORI',
    food: 'Makanan & Minuman',
    transport: 'Transportasi & KRL',
    tech: 'Teknologi & Gadget',
    subscription: 'Langganan & Buku',
    other: 'Lainnya',
    recordTx: 'Simpan Transaksi',

    // Daily Quiz
    dailyQuizChallenge: 'Tantangan Kuis Harian',
    xpRewardBadge: '+50 XP Hadiah',
    submitAnswer: 'Kirim Jawaban',
    claimXpClose: 'Klaim +50 XP & Tutup',
    close: 'Tutup',

    // Savings Goal
    savingsManager: 'Pengelola Target Tabungan',
    depositMoneyTab: '+ Setor Tabungan',
    editGoalDetailsTab: '⚙️ Edit Detail Target',
    currentSavings: 'TERKUMPUL',
    targetAmountLabel: 'TARGET IMPIAN',
    depositAmountLabel: 'NOMINAL SETORAN (RP)',
    depositBtn: 'Setor ke Target Tabungan',
    goalNameLabel: 'NAMA BARANG IMPIAN',
    saveGoalBtn: 'Simpan Detail Target',

    // Notifications
    notificationsTitle: 'Notifikasi Akademik',
    unreadUpdates: '{count} belum dibaca',
    academicAlerts: 'Peringatan Akademik',
    markAllRead: 'Tandai semua terbaca',
    closePanel: 'Tutup Panel',
  },
  en: {
    // Bottom Nav & Header
    dashboard: 'Dashboard',
    missions: 'Missions',
    vault: 'Vault',
    agenda: 'Agenda',
    profile: 'Profile',
    greeting: 'Hey',
    activeToday: '{count} Active Today',
    financialTracker: 'Financial Tracker',
    academicSchedule: 'Academic Schedule',

    // Dashboard
    nextReward: 'Next Reward: Level {level} Mastery Badge',
    xpUntilNext: '{xp} XP until next level',
    nextDeadline: 'Next Deadline',
    studyStreak: 'Study Streak',
    tapToIncrement: 'Tap to increment streak! 🔥',
    days: 'Days',
    hours: 'h',
    minutes: 'm',
    monthlyBudget: 'Monthly Budget',
    budgetLeft: 'left',
    recentAchievements: 'Recent Achievements',
    seeAll: 'See All',

    // Missions
    weeklyGoal: 'WEEKLY GOAL',
    finishMissions: 'Finish Academic Missions',
    completedOf: '{completed} of {total} completed',
    activeMissions: 'Active Missions',
    pending: 'Pending',
    urgent: 'URGENT',
    normal: 'NORMAL',
    later: 'LATER',
    extraXpOpportunities: 'Extra XP Opportunities',
    dailyQuiz: 'Daily Quiz',
    startQuiz: '+50 XP • Start Quiz',
    streakBonus: '5-Day Streak',
    claimBonus: 'Claim +100 XP Bonus',
    searchMissions: 'Search missions...',

    // Vault
    totalBalance: 'Total Financial Balance',
    addMoney: 'Add Money',
    weeklyBurn: 'Weekly Burn',
    thisWeek: 'This Week',
    savingsGoal: 'Savings Goal',
    manageGoal: 'Manage Goal ⚙️',
    recentTransactions: 'Recent Transactions',
    transactionsCount: '{count} Transactions',
    almostThere: 'Almost there! Keep pushing 🚀',
    tapToDeposit: 'Tap to Deposit / Edit',

    // Agenda
    scheduleFor: 'SCHEDULE FOR',
    events: 'Events',
    noEvents: 'No events scheduled for this date.',
    addEvent: 'Add Event',

    // Hero Profile
    editProfile: 'Edit Profile',
    editProfileDetails: 'Edit Profile Details',
    updateProfileDesc: 'Update name, avatar & major',
    heroicBadges: 'Heroic Badges',
    systemConfig: 'System Config',
    appLanguage: 'App Language',
    switchLanguage: 'Bahasa Indonesia & English',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Reduce eye strain',
    notifications: 'Academic Notifications',
    notificationsDesc: 'Stay updated on missions',
    signOut: 'Sign Out',

    // Modals
    // Add Mission
    createNewMission: 'Create New Mission',
    missionTitle: 'MISSION TITLE',
    courseModule: 'COURSE / MODULE',
    priority: 'PRIORITY',
    highPriority: 'High Priority',
    mediumPriority: 'Medium Priority',
    lowPriority: 'Low Priority',
    tag: 'TAG / CATEGORY',
    dueTimeframe: 'DUE TIMEFRAME',
    xpReward: 'XP REWARD',
    cancel: 'Cancel',
    addMissionBtn: 'Add Mission',

    // Add Transaction
    addDepositCredit: 'Add Deposit Credit',
    logExpense: 'Log Expense',
    depositTab: '+ Deposit',
    expenseTab: '- Expense',
    description: 'TRANSACTION DESCRIPTION',
    amountRp: 'AMOUNT (RP)',
    categoryLabel: 'CATEGORY',
    food: 'Food & Drink',
    transport: 'Transport & Rail',
    tech: 'Tech & Gear',
    subscription: 'Services & Books',
    other: 'General',
    recordTx: 'Record Transaction',

    // Daily Quiz
    dailyQuizChallenge: 'Daily Quiz Challenge',
    xpRewardBadge: '+50 XP Reward',
    submitAnswer: 'Submit Answer',
    claimXpClose: 'Claim +50 XP & Close',
    close: 'Close',

    // Savings Goal
    savingsManager: 'Savings Goal Manager',
    depositMoneyTab: '+ Deposit Money',
    editGoalDetailsTab: '⚙️ Edit Goal Details',
    currentSavings: 'CURRENT SAVINGS',
    targetAmountLabel: 'TARGET AMOUNT',
    depositAmountLabel: 'DEPOSIT AMOUNT (RP)',
    depositBtn: 'Deposit to Savings Goal',
    goalNameLabel: 'GOAL ITEM NAME',
    saveGoalBtn: 'Save Goal Details',

    // Notifications
    notificationsTitle: 'Academic Notifications',
    unreadUpdates: '{count} unread updates',
    academicAlerts: 'Academic Alerts',
    markAllRead: 'Mark all as read',
    closePanel: 'Close Panel',
  },
};

export const getTranslation = (lang: LanguageType = 'id') => {
  return i18n[lang] || i18n.id;
};
