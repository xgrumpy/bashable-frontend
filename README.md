## Installation

- **Prequesits:**

  - Your computer must have nodejs installed to run this website. Recommended node version is 16+ versions.
  - To enable login, Follow the [Backend Setup Instructions](https://github.com/afterglowstudios/aiart-backend) first

- **Step-1 :** Navigate to this directory on terminal.

- **Step-2 :** Run the following command bellow to install all required packages:

```bash
npm install
# or
yarn install
```

- **Step-3 :** Open config.ts file from ./src directory, and change config.ts file `API_URL: "https://bashable.art/api"` to your backend api url like `API_URL: "http:backendurl.art/api"`

- **Step-4 :** Now run the development server by running the following command:

```bash
npm run dev
# or
yarn dev
```

- **Step-5 :** Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
