# Restaurant Menu with QR code and Text Transcribe

This project is a React application that allows for a restaurant owner to
1. create user account
2. login
3. upload image menu
4. get QR code to hosted image
5. automatically transcribe image to text
6. allow for all items text searching

Anonymous users can search for all items across all restaurants and get the original menu item.

## Demo

See menu-qr-demo.mov for a full demo walkthrough.
Demo URL: http://menu-qr-code.s3-website-us-east-1.amazonaws.com/

## Code Structure
```
Environment file:				        211B Dec 21 12:15 .env

Prettify settings:				          3B Dec 21 12:15 .prettierrc

This README:					        3.6K Dec 21 12:23 README.md

Lambdas files:					        224B Dec 21 12:15 lambda

Demo Video: 					        131M Dec 21 12:21 menu-qr-demo.mov

Package dependencies file:		        998B Dec 21 12:15 package.json

Public build:					        256B Dec 21 12:15 public

React Source files:				        544B Dec 21 12:18 src
```

## Lambdas:

```
Post account creation user to restaurant mapping: after_signup.py
Gets a full menu and related information based on menu ID: get_menu.py
Gets restaurant details and associated menu: get_restaurant.py
Searches across all menu items and restaurants based on user keywords: search_restaurant.py
Uploads menu from user to S3 bucket, generates QR code and transcribes image to text via Textract: upload_menu.py
```

## React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Sample .env file created

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
