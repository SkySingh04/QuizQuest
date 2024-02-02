## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Akash-Singh04/QuizQuest.git
   ```

2. Install dependencies:

   ```bash
   cd QuizQuest
   npm install
   ```
   
3. Firebase Configuration Setup
- Contact [@kind.of.akash](https://www.instagram.com/kind.of.akash/) on Instagram to get the .env file containing the firebase configurations. After getting the env file skip to step (d).
- Alternatively Contact [@kind.of.akash](https://www.instagram.com/kind.of.akash/) on Instagram to get collaborator access to the firebase project that contains the User Authentication and Firebase Firestore Database. An email will be sent with the invitaion for the same.

4. Steps to Set Firebase Environment Variables

   a. After Getting Collaborator Access:
   - Visit the Firebase Console
   - Navigate to the project settings.

   b. Retrieve Firebase Configuration:
   - In the Firebase project settings, locate and select the "General" tab.
   - Scroll down to the "Your apps" section and click on Quiz-Quest

   c. Copy Configuration Details:
   - After creating the web app, you'll get a configuration object containing keys like `apiKey`, `authDomain`, `projectId`, etc.
   - Copy these configuration details.

   d. Environment Variable Setup:
      - Create a `.env.local` file in the root directory of your project (ensure it's added to `.gitignore` for security).
      - Add the Firebase configuration details as environment variables:

      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
      NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
      NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"  // (Optional, for Analytics)
      ```

   e. Usage in Project:
      - Access these environment variables in your code as `process.env.VARIABLE_NAME`.

   f. Restart Server:
      - After setting environment variables, restart the development server to apply the changes.

   ###### Note:
   - Ensure that you replace `"YOUR_FIREBASE_XXX"` placeholders with the actual values from your Firebase project configuration.
   - Remember to keep your `.env.local` file private and do not expose sensitive credentials in your code repository.

5. Run the project:

   ```bash
   npm run dev
   ```
6. Access the project locally at `http://localhost:3000`.

## Questions or Need Help?

If you have any questions or need further assistance, feel free to open an issue or reach out to [Akash-Singh04](https://github.com/Akash-Singh04).

We appreciate your contributions and look forward to your involvement in improving Quiz-Quest!

# Please view the list of open issues at [Issues](https://github.com/Akash-Singh04/QuizQuest/issues). Any contributions to them are welcome.
