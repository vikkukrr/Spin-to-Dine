const FALLBACK_RESTAURANTS = [
  {
    _id: '000000000000000000000001',
    name: 'Biryani House',
    location: 'Downtown',
    rating: 4.5,
    ratingCount: 230,
    cuisines: ['Biryani', 'North Indian', 'Mughlai'],
    deliveryTime: '30-40 min',
    deliveryFee: 40,
    minOrder: 200,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'
  },
  {
    _id: '000000000000000000000002',
    name: 'Green Leaf Kitchen',
    location: 'Westside',
    rating: 4.3,
    ratingCount: 180,
    cuisines: ['South Indian', 'Vegetarian', 'Healthy'],
    deliveryTime: '25-35 min',
    deliveryFee: 30,
    minOrder: 150,
    vegOnly: true,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  },
  {
    _id: '000000000000000000000003',
    name: 'Pizza Paradise',
    location: 'Central',
    rating: 4.7,
    ratingCount: 450,
    cuisines: ['Pizza', 'Italian', 'Fast Food'],
    deliveryTime: '20-30 min',
    deliveryFee: 50,
    minOrder: 300,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },
  {
    _id: '000000000000000000000004',
    name: 'Spice Garden',
    location: 'Eastside',
    rating: 4.2,
    ratingCount: 150,
    cuisines: ['Chinese', 'Thai', 'Asian'],
    deliveryTime: '35-45 min',
    deliveryFee: 35,
    minOrder: 200,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400'
  },
  {
    _id: '000000000000000000000005',
    name: 'Southern Spice',
    location: 'Southtown',
    rating: 4.4,
    ratingCount: 200,
    cuisines: ['South Indian', 'Dosa', 'Idli'],
    deliveryTime: '25-35 min',
    deliveryFee: 25,
    minOrder: 100,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400'
  },
  {
    _id: '000000000000000000000006',
    name: 'Burger Barn',
    location: 'Central',
    rating: 4.1,
    ratingCount: 320,
    cuisines: ['Burgers', 'American', 'Fast Food'],
    deliveryTime: '20-30 min',
    deliveryFee: 40,
    minOrder: 150,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'
  },
  {
    _id: '000000000000000000000007',
    name: 'Tandoori Flame',
    location: 'Downtown',
    rating: 4.6,
    ratingCount: 290,
    cuisines: ['North Indian', 'Mughlai', 'Tandoori'],
    deliveryTime: '30-40 min',
    deliveryFee: 45,
    minOrder: 250,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'
  },
  {
    _id: '000000000000000000000008',
    name: 'Sushi World',
    location: 'Central',
    rating: 4.8,
    ratingCount: 180,
    cuisines: ['Japanese', 'Sushi', 'Asian'],
    deliveryTime: '25-35 min',
    deliveryFee: 60,
    minOrder: 350,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.pexels.com/photos/14469273/pexels-photo-14469273.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
  },
  {
    _id: '000000000000000000000009',
    name: 'Cafe Coffee Day',
    location: 'Westside',
    rating: 4.0,
    ratingCount: 120,
    cuisines: ['Cafe', 'Beverages', 'Continental'],
    deliveryTime: '15-20 min',
    deliveryFee: 20,
    minOrder: 100,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'
  },
  {
    _id: '000000000000000000000010',
    name: 'The Italian Place',
    location: 'Eastside',
    rating: 4.5,
    ratingCount: 160,
    cuisines: ['Italian', 'Pizza', 'Pasta'],
    deliveryTime: '25-35 min',
    deliveryFee: 35,
    minOrder: 200,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400'
  },
  {
    _id: '000000000000000000000011',
    name: 'Dragon Wok',
    location: 'Eastside',
    rating: 4.3,
    ratingCount: 160,
    cuisines: ['Chinese', 'Thai', 'Noodles'],
    deliveryTime: '25-35 min',
    deliveryFee: 35,
    minOrder: 200,
    vegOnly: false,
    isOpen: true,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=250&fit=crop'
  }
];

const FALLBACK_MENU = [
  { _id: 'm00000000000000000001', name: 'Chicken Dum Biryani', description: 'Aromatic basmati rice cooked with spicy chicken and traditional spices', price: 250, category: 'lunch', veg: false, restaurantId: '000000000000000000000001', available: true, popularity: 150, imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?w=400' },
  { _id: 'm00000000000000000002', name: 'Mutton Biryani', description: 'Tender mutton pieces cooked with fragrant rice', price: 350, category: 'lunch', veg: false, restaurantId: '000000000000000000000001', available: true, popularity: 120, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400' },
  { _id: 'm00000000000000000003', name: 'Vegetable Biryani', description: 'Mixed vegetables cooked with basmati rice and spices', price: 180, category: 'lunch', veg: true, restaurantId: '000000000000000000000001', available: true, popularity: 80, imageUrl: 'https://images.pexels.com/photos/1111317/pexels-photo-1111317.jpeg?w=400' },
  { _id: 'm00000000000000000004', name: 'Chicken 65', description: 'Spicy deep-fried chicken appetizer', price: 200, category: 'snacks', veg: false, restaurantId: '000000000000000000000001', available: true, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
  { _id: 'm00000000000000000005', name: 'Dal Makhani', description: 'Creamy black lentil curry', price: 150, category: 'lunch', veg: true, restaurantId: '000000000000000000000001', available: true, popularity: 70, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
  { _id: 'm00000000000000000006', name: 'Masala Dosa', description: 'Crispy rice crepe with potato filling', price: 120, category: 'breakfast', veg: true, restaurantId: '000000000000000000000002', available: true, popularity: 200, imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=400' },
  { _id: 'm00000000000000000007', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', price: 80, category: 'breakfast', veg: true, restaurantId: '000000000000000000000002', available: true, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
  { _id: 'm00000000000000000008', name: 'Vegetable Uttapam', description: 'Thick pancake with vegetables', price: 140, category: 'breakfast', veg: true, restaurantId: '000000000000000000000002', available: true, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=400' },
  { _id: 'm00000000000000000009', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 220, category: 'lunch', veg: true, restaurantId: '000000000000000000000002', available: true, popularity: 150, imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
  { _id: 'm00000000000000000010', name: 'Fresh Fruit Juice', description: 'Seasonal mixed fruit juice', price: 60, category: 'beverages', veg: true, restaurantId: '000000000000000000000002', available: true, popularity: 80, imageUrl: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?w=400' },
  { _id: 'm00000000000000000011', name: 'Margherita Pizza', description: 'Classic tomato and mozzarella pizza', price: 299, category: 'lunch', veg: true, restaurantId: '000000000000000000000003', available: true, popularity: 250, imageUrl: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?w=400' },
  { _id: 'm00000000000000000012', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni slices', price: 399, category: 'lunch', veg: false, restaurantId: '000000000000000000000003', available: true, popularity: 220, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
  { _id: 'm00000000000000000013', name: 'Veggie Supreme', description: 'Loaded with various vegetables', price: 349, category: 'lunch', veg: true, restaurantId: '000000000000000000000003', available: true, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { _id: 'm00000000000000000014', name: 'Garlic Bread', description: 'Crispy bread with garlic butter', price: 99, category: 'snacks', veg: true, restaurantId: '000000000000000000000003', available: true, popularity: 120, imageUrl: 'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?w=400' },
  { _id: 'm00000000000000000015', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 149, category: 'desserts', veg: true, restaurantId: '000000000000000000000003', available: true, popularity: 200, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400' },
  { _id: 'm00000000000000000016', name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken and vegetables', price: 200, category: 'lunch', veg: false, restaurantId: '000000000000000000000004', available: true, popularity: 170, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { _id: 'm00000000000000000017', name: 'Vegetable Noodles', description: 'Stir-fried noodles with vegetables', price: 150, category: 'lunch', veg: true, restaurantId: '000000000000000000000004', available: true, popularity: 140, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { _id: 'm00000000000000000018', name: 'Spring Rolls', description: 'Crispy vegetable rolls', price: 120, category: 'snacks', veg: true, restaurantId: '000000000000000000000004', available: true, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1606331191459-420dc2fa5d3d?w=400' },
  { _id: 'm00000000000000000019', name: 'Manchurian', description: 'Fried balls in spicy sauce', price: 180, category: 'snacks', veg: true, restaurantId: '000000000000000000000004', available: true, popularity: 160, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400' },
  { _id: 'm00000000000000000020', name: 'Chicken Chettinad', description: 'Spicy chicken curry with Chettinad spices', price: 280, category: 'lunch', veg: false, restaurantId: '000000000000000000000005', available: true, popularity: 130, imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=400' },
  { _id: 'm00000000000000000021', name: 'Fish Fry', description: 'Crispy fried fish with spices', price: 250, category: 'lunch', veg: false, restaurantId: '000000000000000000000005', available: true, popularity: 110, imageUrl: 'https://images.unsplash.com/photo-1598514983318-29142275b1d4?w=400' },
  { _id: 'm00000000000000000022', name: 'Pongal', description: 'Rice and lentil dish with pepper', price: 100, category: 'breakfast', veg: true, restaurantId: '000000000000000000000005', available: true, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
  { _id: 'm00000000000000000023', name: 'Chicken 65', description: 'Spicy fried chicken', price: 180, category: 'snacks', veg: false, restaurantId: '000000000000000000000005', available: true, popularity: 140, imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400' },
  { _id: 'm00000000000000000024', name: 'Classic Cheese Burger', description: 'Beef patty with cheese and veggies', price: 199, category: 'lunch', veg: false, restaurantId: '000000000000000000000006', available: true, popularity: 200, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { _id: 'm00000000000000000025', name: 'Veggie Burger', description: 'Plant-based patty with fresh vegetables', price: 169, category: 'lunch', veg: true, restaurantId: '000000000000000000000006', available: true, popularity: 150, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400' },
  { _id: 'm00000000000000000026', name: 'Chicken Wings', description: 'Crispy fried chicken wings', price: 249, category: 'snacks', veg: false, restaurantId: '000000000000000000000006', available: true, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400' },
  { _id: 'm00000000000000000027', name: 'Onion Rings', description: 'Crispy battered onion rings', price: 99, category: 'snacks', veg: true, restaurantId: '000000000000000000000006', available: true, popularity: 120, imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' },
  { _id: 'm00000000000000000028', name: 'Milkshake', description: 'Creamy vanilla milkshake', price: 129, category: 'beverages', veg: true, restaurantId: '000000000000000000000006', available: true, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
  { _id: 'm00000000000000000029', name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 320, category: 'lunch', veg: false, restaurantId: '000000000000000000000007', available: true, popularity: 190, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
  { _id: 'm00000000000000000030', name: 'Tandoori Chicken', description: 'Spiced yogurt-marinated chicken', price: 280, category: 'lunch', veg: false, restaurantId: '000000000000000000000007', available: true, popularity: 160, imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
  { _id: 'm00000000000000000031', name: 'Naan Basket', description: 'Assorted Indian breads', price: 120, category: 'lunch', veg: true, restaurantId: '000000000000000000000007', available: true, popularity: 110, imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
  { _id: 'm00000000000000000032', name: 'Gulab Jamun', description: 'Deep-fried milk dumplings in syrup', price: 80, category: 'desserts', veg: true, restaurantId: '000000000000000000000007', available: true, popularity: 130, imageUrl: 'https://images.unsplash.com/photo-1666190050260-658bdd77237c?w=400' },
  { _id: 'm00000000000000000033', name: 'Salmon Sushi', description: 'Fresh salmon nigiri', price: 450, category: 'lunch', veg: false, restaurantId: '000000000000000000000008', available: true, popularity: 170, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400' },
  { _id: 'm00000000000000000034', name: 'California Roll', description: 'Crab and avocado roll', price: 350, category: 'lunch', veg: false, restaurantId: '000000000000000000000008', available: true, popularity: 140, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
  { _id: 'm00000000000000000035', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 150, category: 'snacks', veg: true, restaurantId: '000000000000000000000008', available: true, popularity: 90, imageUrl: 'https://images.unsplash.com/photo-1564085352725-08da0272627a?w=400' },
  { _id: 'm00000000000000000036', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 120, category: 'dinner', veg: true, restaurantId: '000000000000000000000008', available: true, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1607301405390-d831c242f59c?w=400' },
  { _id: 'm00000000000000000037', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 150, category: 'beverages', veg: true, restaurantId: '000000000000000000000009', available: true, popularity: 200, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { _id: 'm00000000000000000038', name: 'Cold Coffee', description: 'Chilled coffee with ice cream', price: 180, category: 'beverages', veg: true, restaurantId: '000000000000000000000009', available: true, popularity: 160, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { _id: 'm00000000000000000039', name: 'Club Sandwich', description: 'Grilled sandwich with veggies', price: 200, category: 'lunch', veg: true, restaurantId: '000000000000000000000009', available: true, popularity: 120, imageUrl: 'https://images.unsplash.com/photo-1567234669003-dce7a7c88821?w=400' },
  { _id: 'm00000000000000000040', name: 'Blueberry Muffin', description: 'Freshly baked blueberry muffin', price: 90, category: 'snacks', veg: true, restaurantId: '000000000000000000000009', available: true, popularity: 80, imageUrl: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=400' },
  { _id: 'm00000000000000000041', name: 'Spaghetti Carbonara', description: 'Classic Italian pasta with creamy sauce', price: 299, category: 'dinner', veg: false, restaurantId: '000000000000000000000010', available: true, popularity: 180, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
  { _id: 'm00000000000000000042', name: 'Margherita Pizza', description: 'Wood-fired classic pizza', price: 349, category: 'lunch', veg: true, restaurantId: '000000000000000000000010', available: true, popularity: 160, imageUrl: 'https://images.unsplash.com/photo-1574071318501-1cd9d8b10f10?w=400' },
  { _id: 'm00000000000000000043', name: 'Penne Arrabbiata', description: 'Spicy tomato sauce pasta', price: 249, category: 'dinner', veg: true, restaurantId: '000000000000000000000010', available: true, popularity: 130, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
  { _id: 'm00000000000000000044', name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 199, category: 'desserts', veg: true, restaurantId: '000000000000000000000010', available: true, popularity: 150, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
  { _id: 'm00000000000000000045', name: 'Bruschetta', description: 'Toasted bread with tomato topping', price: 149, category: 'snacks', veg: true, restaurantId: '000000000000000000000010', available: true, popularity: 100, imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400' },
  { _id: 'm00000000000000000046', name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and vegetables', price: 280, category: 'lunch', veg: false, restaurantId: '000000000000000000000011', available: true, popularity: 170, imageUrl: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400' },
  { _id: 'm00000000000000000047', name: 'Vegetable Noodles', description: 'Wok-tossed noodles with fresh vegetables', price: 160, category: 'lunch', veg: true, restaurantId: '000000000000000000000011', available: true, popularity: 150, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { _id: 'm00000000000000000048', name: 'Tom Yum Soup', description: 'Hot and sour Thai soup with shrimp', price: 220, category: 'dinner', veg: false, restaurantId: '000000000000000000000011', available: true, popularity: 130, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400' },
  { _id: 'm00000000000000000049', name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with dipping sauce', price: 140, category: 'snacks', veg: true, restaurantId: '000000000000000000000011', available: true, popularity: 120, imageUrl: 'https://images.unsplash.com/photo-1606331191459-420dc2fa5d3d?w=400' },
  { _id: 'm00000000000000000050', name: 'Chicken Fried Rice', description: 'Wok-fried rice with chicken and vegetables', price: 200, category: 'lunch', veg: false, restaurantId: '000000000000000000000011', available: true, popularity: 160, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' }
];

const FALLBACK_ORDERS = [
  {
    _id: 'ord00000000000000000001',
    restaurantName: 'Pizza Paradise',
    restaurantId: { _id: '000000000000000000000003', name: 'Pizza Paradise' },
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 299 },
      { name: 'Garlic Bread', quantity: 1, price: 99 }
    ],
    totalAmount: 747,
    deliveryFee: 50,
    deliveryStatus: 'delivered',
    deliveryAddress: '123 Main St, Downtown',
    paymentMethod: 'cash',
    orderedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'ord00000000000000000002',
    restaurantName: 'Biryani House',
    restaurantId: { _id: '000000000000000000000001', name: 'Biryani House' },
    items: [
      { name: 'Chicken Dum Biryani', quantity: 1, price: 250 },
      { name: 'Chicken 65', quantity: 1, price: 200 }
    ],
    totalAmount: 490,
    deliveryFee: 40,
    deliveryStatus: 'out_for_delivery',
    deliveryAddress: '456 Oak Ave, Westside',
    paymentMethod: 'online',
    orderedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'ord00000000000000000003',
    restaurantName: 'Green Leaf Kitchen',
    restaurantId: { _id: '000000000000000000000002', name: 'Green Leaf Kitchen' },
    items: [
      { name: 'Masala Dosa', quantity: 2, price: 120 },
      { name: 'Fresh Fruit Juice', quantity: 1, price: 60 }
    ],
    totalAmount: 330,
    deliveryFee: 30,
    deliveryStatus: 'preparing',
    deliveryAddress: '789 Pine Rd, Central',
    paymentMethod: 'card',
    orderedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    _id: 'ord00000000000000000004',
    restaurantName: 'Burger Barn',
    restaurantId: { _id: '000000000000000000000006', name: 'Burger Barn' },
    items: [
      { name: 'Classic Cheese Burger', quantity: 1, price: 199 },
      { name: 'Chicken Wings', quantity: 2, price: 249 },
      { name: 'Milkshake', quantity: 1, price: 129 }
    ],
    totalAmount: 866,
    deliveryFee: 40,
    deliveryStatus: 'placed',
    deliveryAddress: '321 Elm St, Central',
    paymentMethod: 'cash',
    orderedAt: new Date().toISOString()
  },
  {
    _id: 'ord00000000000000000005',
    restaurantName: 'Southern Spice',
    restaurantId: { _id: '000000000000000000000005', name: 'Southern Spice' },
    items: [
      { name: 'Chicken Chettinad', quantity: 1, price: 280 },
      { name: 'Fish Fry', quantity: 1, price: 250 }
    ],
    totalAmount: 555,
    deliveryFee: 25,
    deliveryStatus: 'confirmed',
    deliveryAddress: '654 Maple Dr, Southtown',
    paymentMethod: 'online',
    orderedAt: new Date(Date.now() - 1800000).toISOString()
  }
];

const FALLBACK_FAVORITES = [
  {
    _id: 'fav00000000000000000001',
    restaurantId: {
      _id: '000000000000000000000003',
      name: 'Pizza Paradise',
      rating: 4.7,
      cuisines: ['Pizza', 'Italian', 'Fast Food'],
      deliveryTime: '20-30 min',
      deliveryFee: 50,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
    }
  },
  {
    _id: 'fav00000000000000000002',
    restaurantId: {
      _id: '000000000000000000000001',
      name: 'Biryani House',
      rating: 4.5,
      cuisines: ['Biryani', 'North Indian', 'Mughlai'],
      deliveryTime: '30-40 min',
      deliveryFee: 40,
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400'
    }
  },
  {
    _id: 'fav00000000000000000003',
    restaurantId: {
      _id: '000000000000000000000008',
      name: 'Sushi World',
      rating: 4.8,
      cuisines: ['Japanese', 'Sushi', 'Asian'],
      deliveryTime: '25-35 min',
      deliveryFee: 60,
      imageUrl: 'https://images.pexels.com/photos/14469273/pexels-photo-14469273.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
    }
  },
  {
    _id: 'fav00000000000000000004',
    restaurantId: {
      _id: '000000000000000000000010',
      name: 'The Italian Place',
      rating: 4.5,
      cuisines: ['Italian', 'Pizza', 'Pasta'],
      deliveryTime: '25-35 min',
      deliveryFee: 35,
      imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400'
    }
  }
];

const CUISINE_OPTIONS = ['All', 'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mughlai', 'Fast Food', 'American', 'Thai', 'Asian', 'Healthy', 'Vegetarian', 'Japanese', 'Cafe', 'Continental', 'Tandoori', 'Sushi', 'Pasta'];

const LOCATIONS = ['All Locations', 'Downtown', 'Westside', 'Central', 'Eastside', 'Southtown'];

export function getFallbackRestaurants(filters = {}) {
  let filtered = [...FALLBACK_RESTAURANTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.some(c => c.toLowerCase().includes(q)) ||
      r.location.toLowerCase().includes(q)
    );
  }
  if (filters.rating) {
    filtered = filtered.filter(r => r.rating >= Number(filters.rating));
  }
  if (filters.veg) {
    filtered = filtered.filter(r => r.vegOnly);
  }
  if (filters.cuisine && filters.cuisine !== 'All') {
    const c = filters.cuisine.toLowerCase();
    filtered = filtered.filter(r => r.cuisines.some(cu => cu.toLowerCase().includes(c)));
  }
  if (filters.location && filters.location !== 'All Locations') {
    filtered = filtered.filter(r => r.location === filters.location);
  }
  if (filters.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'deliveryTime') {
    filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  } else if (filters.sortBy === 'minOrder') {
    filtered.sort((a, b) => a.minOrder - b.minOrder);
  } else if (filters.sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const restaurants = filtered.slice(start, start + limit);

  return { restaurants, totalPages, currentPage: page, total };
}

export function getFallbackRestaurantById(id) {
  const restaurant = FALLBACK_RESTAURANTS.find(r => r._id === id);
  if (!restaurant) return null;
  const menu = FALLBACK_MENU.filter(m => m.restaurantId === id);
  return { restaurant, menu };
}

export function getFallbackMenuByRestaurantId(id) {
  return FALLBACK_MENU.filter(m => m.restaurantId === id);
}

export function getFallbackOrders(filters = {}) {
  let orders = [...FALLBACK_ORDERS];
  if (filters.status && filters.status !== 'all') {
    orders = orders.filter(o => o.deliveryStatus === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    orders = orders.filter(o =>
      o.restaurantName.toLowerCase().includes(q) ||
      o.items.some(i => i.name.toLowerCase().includes(q))
    );
  }
  orders.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
  return orders;
}

const FALLBACK_SPIN_SUGGESTIONS = [
  {
    _id: 'spin_fb_001',
    name: 'Butter Chicken',
    price: 320,
    category: 'lunch',
    veg: false,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    restaurant: { _id: '000000000000000000007', name: 'Tandoori Flame', location: 'Downtown', rating: 4.6 },
    scores: { pastOrderFrequency: 0.8, timeMatch: 1, locationTrend: 0.8, budgetMatch: 0.7, total: 0.82 },
    timeSlot: 'lunch'
  },
  {
    _id: 'spin_fb_002',
    name: 'Classic Cheese Burger',
    price: 199,
    category: 'lunch',
    veg: false,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    restaurant: { _id: '000000000000000000006', name: 'Burger Barn', location: 'Central', rating: 4.1 },
    scores: { pastOrderFrequency: 0.9, timeMatch: 0.8, locationTrend: 0.7, budgetMatch: 0.9, total: 0.84 },
    timeSlot: 'lunch'
  },
  {
    _id: 'spin_fb_003',
    name: 'Masala Dosa',
    price: 120,
    category: 'breakfast',
    veg: true,
    imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=400',
    restaurant: { _id: '000000000000000000002', name: 'Green Leaf Kitchen', location: 'Westside', rating: 4.3 },
    scores: { pastOrderFrequency: 0.6, timeMatch: 1, locationTrend: 0.6, budgetMatch: 1, total: 0.76 },
    timeSlot: 'breakfast'
  },
  {
    _id: 'spin_fb_004',
    name: 'Pepperoni Pizza',
    price: 399,
    category: 'lunch',
    veg: false,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    restaurant: { _id: '000000000000000000003', name: 'Pizza Paradise', location: 'Central', rating: 4.7 },
    scores: { pastOrderFrequency: 0.7, timeMatch: 0.8, locationTrend: 0.9, budgetMatch: 0.5, total: 0.72 },
    timeSlot: 'lunch'
  },
  {
    _id: 'spin_fb_005',
    name: 'Salmon Sushi',
    price: 450,
    category: 'lunch',
    veg: false,
    imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400',
    restaurant: { _id: '000000000000000000008', name: 'Sushi World', location: 'Central', rating: 4.8 },
    scores: { pastOrderFrequency: 0.4, timeMatch: 0.8, locationTrend: 0.5, budgetMatch: 0.4, total: 0.5 },
    timeSlot: 'lunch'
  }
];

export function getFallbackFavorites() {
  return FALLBACK_FAVORITES;
}

export function getFallbackSpinSuggestions(userId) {
  return {
    suggestions: FALLBACK_SPIN_SUGGESTIONS,
    spinsRemaining: 3,
    todaySpinCount: 0,
    currentStreak: 0,
    loyaltyPoints: 0
  };
}

export function createFallbackSpinLog(data) {
  return {
    message: 'Spin logged',
    log: { ...data, _id: 'spin_log_' + Date.now(), spinDate: new Date().toISOString() },
    loyaltyPoints: 10,
    currentStreak: 1,
    totalSpins: 1,
    pointsEarned: 10
  };
}

export function createFallbackOrder(orderData) {
  return {
    _id: 'ord_fallback_' + Date.now(),
    ...orderData,
    deliveryStatus: 'placed',
    orderedAt: new Date().toISOString()
  };
}
