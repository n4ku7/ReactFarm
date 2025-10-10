# AgriCraft React

AgriCraft is a global marketplace for value-added farm goods, designed to connect farmers with buyers worldwide. This project is built with React 18 and Vite 7, using Material UI (MUI) and a custom light pastel theme.

## Project Structure

The project is organized as follows:

agricraft-react
├── public
│   └── index.html               # Main HTML file for the React application
├── src
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Entry point for the React application
│   ├── theme.js                 # MUI theme configuration
│   ├── assets
│   │   ├── css
│   │   │   └── theme.css        # Custom styles for the application
│   │   ├── img                  # Directory for images
│   │   └── js
│   │       ├── main.js          # Custom JavaScript functionality
│   │       └── performance.js    # Performance-related scripts
│   ├── components
│   │   └── common
│   │       ├── Footer.jsx       # Footer component
│   │       ├── Navbar.jsx       # Navigation bar component
│   │       └── ThemeProvider.jsx # MUI theme provider component
│   ├── pages
│   │   ├── AdminDashboard
│   │   │   ├── Index.jsx        # Main component for the Admin Dashboard
│   │   │   ├── ReportsAnalytics.jsx # Reports and Analytics component
│   │   │   ├── ManageProducts
│   │   │   │   ├── ApproveListings.jsx # Component for approving product listings
│   │   │   │   └── EditRemove.jsx # Component for editing or removing products
│   │   │   ├── ManageTransactions
│   │   │   │   ├── ResolveDisputes.jsx # Component for resolving disputes
│   │   │   │   └── ViewOrders.jsx # Component for viewing orders
│   │   │   ├── ManageUsers
│   │   │   │   ├── ApproveSuspend.jsx # Component for approving or suspending users
│   │   │   │   └── ViewAll.jsx # Component for viewing all users
│   │   │   └── PlatformSettings
│   │   │       ├── CategoriesTags.jsx # Component for managing categories and tags
│   │   │       └── ContentManagement.jsx # Component for managing content
│   │   ├── BuyerDashboard
│   │   │   ├── FeedbackReviews.jsx # Component for displaying feedback and reviews
│   │   │   ├── Index.jsx        # Main component for the Buyer Dashboard
│   │   │   ├── ProfileManagement.jsx # Component for managing buyer profiles
│   │   │   ├── BrowseProducts
│   │   │   │   ├── Categories.jsx # Component for browsing product categories
│   │   │   │   └── SearchFilter.jsx # Component for searching products
│   │   │   ├── CartCheckout
│   │   │   │   ├── Payment.jsx  # Component for handling payment during checkout
│   │   │   │   └── Shipping.jsx  # Component for handling shipping details
│   │   │   ├── Orders
│   │   │   │   ├── OrderHistory.jsx # Component for viewing order history
│   │   │   │   └── TrackOrders.jsx # Component for tracking orders
│   │   │   └── ProductDetail
│   │   │       └── Index.jsx    # Component for displaying product details
│   │   ├── FarmerDashboard
│   │   │   ├── EarningsPayouts.jsx # Component for displaying earnings and payouts
│   │   │   ├── Index.jsx        # Main component for the Farmer Dashboard
│   │   │   ├── MessagesChat.jsx # Component for messaging and chat functionality
│   │   │   ├── Orders
│   │   │   │   ├── AcceptReject.jsx # Component for accepting or rejecting orders
│   │   │   │   ├── ShippingUpdates.jsx # Component for providing shipping updates
│   │   │   │   └── ViewOrders.jsx # Component for viewing orders
│   │   │   ├── ProductManagement
│   │   │   │   ├── AddProduct.jsx # Component for adding new products
│   │   │   │   ├── EditDelete.jsx # Component for editing or deleting products
│   │   │   │   └── ManageInventory.jsx # Component for managing inventory
│   │   │   └── ProfileManagement
│   │   │       ├── CertificatesApprovals.jsx # Component for managing certificate approvals
│   │   │       └── UpdateFarmInfo.jsx # Component for updating farm information
│   │   ├── GlobalMarketplace
│   │   │   ├── Categories.jsx    # Component for displaying product categories
│   │   │   ├── FeaturedFarmers.jsx # Component for showcasing featured farmers
│   │   │   ├── SearchFilters.jsx # Component for applying search filters
│   │   │   └── TrendingProducts.jsx # Component for displaying trending products
│   │   └── Home
│   │       ├── About.jsx        # About page component
│   │       ├── Contact.jsx      # Contact page component
│   │       └── LoginRegister
│   │           ├── AdminLogin.jsx # Admin Login component
│   │           ├── BuyerSignup.jsx # Buyer Signup component
│   │           ├── FarmerSignup.jsx # Farmer Signup component
│   │           ├── Login.jsx     # Login component
│   │           └── Register.jsx  # Register component
├── package.json                 # npm configuration file
├── vite.config.js               # Vite configuration file
└── README.md                     # Project documentation

## Getting Started

Follow these steps to run the app locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd agricraft-react
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

Notes:
- On Windows PowerShell, use `;` to chain commands (not `&&`). Example:
  ```powershell
  cd .\agricraft-react; npm run dev
  ```
- To expose on your LAN, run: `vite --host` or set in `vite.config.js`.

Troubleshooting:
- If you see dependency optimize/re-optimize messages on first run, this is normal.
- If the port is busy, change the dev port in `vite.config.js` under `server.port`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

## Theme

This project ships with a light pastel theme:
- Primary: soft blue (`#8ecae6`), Secondary: soft pink (`#ffb3c1`)
- Neutral backgrounds, gentle elevation, rounded corners
- MUI theme in `src/theme.js` and global CSS tokens in `src/assets/css/theme.css`

Global baseline styles are applied via MUI `CssBaseline` in `src/components/common/ThemeProvider.jsx`.

This project is licensed under the MIT License. See the LICENSE file for more details.