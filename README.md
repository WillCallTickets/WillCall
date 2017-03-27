# Will Call Tickets

## Understanding Class Hierarchy
#### Shows->ShowDates->ShowTickets
```
  Shows  
    |__ShowDates
        |__ShowTickets
```
<dl>
  <dt>Shows</dt>
    <dd>A logical grouping of ShowDates at a specified venue<br/>
    <em><small>ie: Star Wars at Downtown Cineplex</small></em></dd>
  <dt>ShowDates</dt>
    <dd>The actual showings or playtimes of a show. <br/>
    <em><small>3PM, 4PM</small></em></dd>
  <dt>ShowTickets</dt>
    <dd>The individual seats for a ShowDate</dd>  
    <dd>Each entry in ShowTickets keeps track of it's own inventory</dd>
</dl>
  

#### Products->ProductSKUs
```
  Products  
    |__ProductSkus
```
<dl>
  <dt>Products</dt>
  <dd>A logical grouping of ProductSkus<br/>
    <em><small>ie: &quot;I'm with Stupid ->&quot; T-shirt</small></em></dd>
  <dt>ProductSKUs</dt>
    <dd>An individual product item with it's own distinct attribs/variations. <br/>
    <em><small>color: red, size: small, allotment: 125</small></em></dd>
    <dd>Each entry in the ProductSKU keeps track of it's own inventory</dd>
</dl>
  
  
## STRIPE Considerations
TODO Allow for concurrent prod and dev environments  

You will need to configure the redirect url to work for localhost vs production. As 
production is not an actual running "live" environment, I am doing a bit of a hack 
to make the endpoints work. You will need to set the redirect URI to work for either 
localhost or the heroku app.   
Visit https://dashboard.stripe.com/account/applications/settings
and under Development->Redirect URIs, simply change the order of the URIs to use as 
default. 

## STYLING
To apply user styles, navigate to the public/css/bootplate or public/css/materialplate 
directories and use the appropriate files.

## Project Setup:
+ Create a postgres database and setup default connection at knexfile.js 
+ Create a .env file 


#### Set up .env vars
NODE_ENV=development  
DATABASE_URL=  
HOST=localhost:3000

EMAIL_CONTACT=  
MAILGUN_USERNAME=  
MAILGUN_PASSWORD=

TOKEN_SECRET=

GOOGLE_CLIENT=  
GOOGLE_SECRET=

STRIPE_SECRET=  
STRIPE_PUBLISH=  
STRIPE_CLIENT_ID=  
STRIPE_TOKEN_URL=

SESSION_KEY1=  
SESSION_KEY2=  
SESSION_KEY3=


#### Key generator helper
To generate your own session keys...  
```node -e "require('crypto').randomBytes(48, function(ex, buf) { console.log(buf.toString('hex')) });"```


#### More Steps for database setup
+ knex run migrate:latest
+ knex run seed:run