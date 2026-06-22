import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          nav: { home: 'Home', spin: 'Spin', spinHistory: 'Spin History', leaderboard: 'Leaderboard', admin: 'Admin', orders: 'Orders', favorites: 'Favorites', login: 'Login', signUp: 'Sign Up', logout: 'Logout' },
          home: { heroTitle: 'Discover Delicious Food', heroSub: 'Fresh flavors, crafted with care — order from your favorites or spin to find your next meal!', search: 'Search restaurants or cuisines...', searchBtn: 'Search', filterBy: 'Filter By:', allRatings: 'All Ratings', vegOnly: 'Veg Only', apply: 'Apply', clear: 'Clear', restaurantsFound: 'restaurants found', nearYou: 'Restaurants Near You', noResults: 'No restaurants found', clearFilters: 'Clear Filters', previous: 'Previous', next: 'Next', page: 'Page' },
          auth: { welcomeBack: 'Welcome Back', loginSub: 'Log in to continue your food journey', email: 'Email', password: 'Password', login: 'Login', loggingIn: 'Logging in...', noAccount: "Don't have an account?", register: 'Register', join: 'Join Spin-to-Dine', registerSub: 'Create your account and start exploring flavors!', name: 'Full Name', deliveryAddress: 'Delivery Address', budgetRange: 'Budget Range', budgetLow: 'Budget Friendly', budgetMedium: 'Medium', budgetHigh: 'Premium', createAccount: 'Register', creatingAccount: 'Creating Account...', haveAccount: 'Already have an account?', forgotPassword: 'Forgot Password?', forgotSub: 'Enter your email to receive a reset link', sendLink: 'Send Reset Link', sending: 'Sending...', backToLogin: 'Back to Login', resetPassword: 'Reset Password', newPassword: 'New Password', confirmPassword: 'Confirm Password', resetting: 'Resetting...', resetSuccess: 'Password reset successful! Redirecting to login...' },
          cart: { empty: 'Your cart is empty', browse: 'Browse Restaurants', checkout: 'Checkout', clearCart: 'Clear Cart', item: 'Item', items: 'Items', subtotal: 'Subtotal', deliveryFee: 'Delivery Fee', total: 'Total', placeOrder: 'Place Order', placingOrder: 'Placing Order...' },
          checkout: { title: 'Checkout', deliveryDetails: 'Delivery Details', deliverTo: 'Deliver to', paymentMethod: 'Payment Method', cash: 'Cash on Delivery', card: 'Card Payment', online: 'Online Payment', orderSummary: 'Order Summary', placeOrder: 'Place Order' },
          orders: { title: 'My Orders', noOrders: 'No orders yet', noOrdersSub: 'Start exploring and order your favorite food!', browse: 'Browse Restaurants', cancel: 'Cancel Order', all: 'All', searchOrders: 'Search orders...', startDate: 'Start Date', endDate: 'End Date' },
          profile: { title: 'My Profile', loyaltyPoints: 'Loyalty Points', totalSpins: 'Total Spins', dayStreak: 'Day Streak', badges: 'Badges', badgesEarned: 'Badges Earned', editProfile: 'Edit Profile', saveChanges: 'Save Changes', saving: 'Saving...', changePassword: 'Change Password', currentPassword: 'Current Password', newPassword: 'New Password', confirmPassword: 'Confirm Password', changing: 'Changing...' },
          spin: { spin: 'Spin & Discover', sub: 'Let fate decide your next meal!', points: 'Points', spinsLeft: 'spins left today', streak: 'Day Streak', spinBtn: 'SPIN!', spinning: 'Spinning...', youGot: 'You got!', matchScore: 'Match Score', addToCart: 'Add to Cart', close: 'Close', maxSpins: 'You\'ve used all your spins for today!', suggestion: 'Today\'s Suggestions' },
          leaderboard: { title: 'Leaderboard', sub: 'Top food explorers', points: 'By Points', spins: 'By Spins', streak: 'By Streak', rank: 'Rank', name: 'Name', badges: 'Badges' },
          admin: { dashboard: 'Admin Dashboard', orders: 'Orders', users: 'Users', restaurants: 'Restaurants', menuItems: 'Menu Items', badges: 'Badges', totalUsers: 'Total Users', totalOrders: 'Total Orders', totalRestaurants: 'Restaurants', totalMenuItems: 'Menu Items', totalRevenue: 'Total Revenue', add: 'Add', edit: 'Edit', delete: 'Delete' },
          favorites: { title: 'My Favorites', empty: 'No favorites yet', emptySub: 'Save your favorite restaurants for quick access!', browse: 'Browse Restaurants', viewMenu: 'View Menu', remove: 'Remove' },
          reviews: { title: 'Reviews', writeReview: 'Write a Review', yourRating: 'Your Rating', comment: 'Comment', submit: 'Submit Review', noReviews: 'No reviews yet', beFirst: 'Be the first to review!' },
          common: { loading: 'Loading...', error: 'Something went wrong', reload: 'Reload Page', noResults: 'No results found' }
        }
      },
      hi: {
        translation: {
          nav: { home: 'होम', spin: 'स्पिन', spinHistory: 'स्पिन इतिहास', leaderboard: 'लीडरबोर्ड', admin: 'एडमिन', orders: 'ऑर्डर', favorites: 'पसंदीदा', login: 'लॉग इन', signUp: 'साइन अप', logout: 'लॉग आउट' },
          home: { heroTitle: 'स्वादिष्ट भोजन खोजें', heroSub: 'ताज़ा स्वाद, देखभाल से तैयार — अपने पसंदीदा से ऑर्डर करें या अगला भोजन खोजने के लिए स्पिन करें!', search: 'रेस्तरां या व्यंजन खोजें...', searchBtn: 'खोजें', filterBy: 'फ़िल्टर:', allRatings: 'सभी रेटिंग', vegOnly: 'केवल शाकाहारी', apply: 'लागू करें', clear: 'साफ़ करें', nearYou: 'आपके निकट रेस्तरां', noResults: 'कोई रेस्तरां नहीं मिला', page: 'पृष्ठ' },
          auth: { welcomeBack: 'वापसी पर स्वागत है', loginSub: 'अपनी भोजन यात्रा जारी रखने के लिए लॉग इन करें', email: 'ईमेल', password: 'पासवर्ड', login: 'लॉग इन', loggingIn: 'लॉग इन हो रहा है...', noAccount: 'खाता नहीं है?', register: 'रजिस्टर', join: 'स्पिन-टू-डाइन में शामिल हों', registerSub: 'खाता बनाएं और स्वादों की खोज शुरू करें!', name: 'पूरा नाम', deliveryAddress: 'डिलीवरी पता', budgetRange: 'बजट रेंज', createAccount: 'रजिस्टर', haveAccount: 'पहले से खाता है?', forgotPassword: 'पासवर्ड भूल गए?', sendLink: 'रीसेट लिंक भेजें', backToLogin: 'लॉगिन पर वापस जाएं', resetPassword: 'पासवर्ड रीसेट करें', newPassword: 'नया पासवर्ड', confirmPassword: 'पासवर्ड की पुष्टि करें' },
          cart: { empty: 'आपकी कार्ट खाली है', browse: 'रेस्तरां ब्राउज़ करें', checkout: 'चेकआउट', clearCart: 'कार्ट साफ़ करें', subtotal: 'उप-योग', deliveryFee: 'डिलीवरी शुल्क', total: 'कुल', placeOrder: 'ऑर्डर करें' },
          orders: { title: 'मेरे ऑर्डर', noOrders: 'अभी तक कोई ऑर्डर नहीं', browse: 'रेस्तरां ब्राउज़ करें', cancel: 'ऑर्डर रद्द करें', all: 'सभी' },
          profile: { title: 'मेरी प्रोफ़ाइल', loyaltyPoints: 'लॉयल्टी पॉइंट्स', totalSpins: 'कुल स्पिन', dayStreak: 'दिनों का स्ट्रीक', badges: 'बैज', editProfile: 'प्रोफ़ाइल संपादित करें', saveChanges: 'बदलाव सहेजें', changePassword: 'पासवर्ड बदलें' },
          spin: { spin: 'स्पिन करें और खोजें', sub: 'भाग्य को अपना अगला भोजन तय करने दें!', points: 'पॉइंट्स', spinsLeft: 'आज स्पिन बाकी', streak: 'स्ट्रीक', spinBtn: 'स्पिन!', youGot: 'आपको मिला!', matchScore: 'मैच स्कोर', addToCart: 'कार्ट में जोड़ें', close: 'बंद करें', maxSpins: 'आपने आज के सभी स्पिन का उपयोग कर लिया है!' },
          leaderboard: { title: 'लीडरबोर्ड', sub: 'शीर्ष खाद्य खोजकर्ता', points: 'पॉइंट्स द्वारा', spins: 'स्पिन द्वारा', streak: 'स्ट्रीक द्वारा' },
          admin: { dashboard: 'एडमिन डैशबोर्ड', orders: 'ऑर्डर', users: 'उपयोगकर्ता', restaurants: 'रेस्तरां', menuItems: 'मेनू आइटम', badges: 'बैज', totalUsers: 'कुल उपयोगकर्ता', totalOrders: 'कुल ऑर्डर', totalRestaurants: 'रेस्तरां', totalRevenue: 'कुल राजस्व' },
          favorites: { title: 'मेरे पसंदीदा', empty: 'अभी तक कोई पसंदीदा नहीं', browse: 'रेस्तरां ब्राउज़ करें', viewMenu: 'मेनू देखें', remove: 'हटाएं' },
          common: { loading: 'लोड हो रहा है...', error: 'कुछ गलत हो गया', reload: 'पेज रीलोड करें' }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
