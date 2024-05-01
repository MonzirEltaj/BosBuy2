# BosBuy2
BosBuy2


Client: - npx create-react-app client - npm init - npm install react-router-dom - npm install axios - npm i --save axios Server: - npm init -y - npm i --save express mongoose nodemon dotenv cors

For signing into company, for right now, use userID: BosBuy and Password: p.

There are two ways we can show products, either only show BosBuy products and everyone elses on separate page, or show all products on every page

This way all products will be listed under them until we add functionality of separating products by their company. In order to do that we would have to implement a method in the productSort.js that only shows products by BosBuy on our homepages. We should probably make a separate companyProductSort.js for separating products by company _id on their own separate pages.
