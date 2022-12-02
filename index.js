import * as dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

// All the URLs for all of the processes
const POSTReqURL = process.env.POST_REQ_API;
const url = process.env.REG_REQ_API;
const DiscordWebHook = process.env.DISCORD_WEBHOOK;
const GraphQLAPI = process.env.FOOD_MENU_GRAPHQL_API;

async function getGraphQLData() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  // Query for the GraphQL Api for getting the food menu
  const query = `
        site0: menuType(id: "5d13bb11534a134661b51588") {
          name
          items(start_date: "8/31/2022", end_date: "8/31/2022") {
            product {
              name
            }
          }
        }
        site1: menuType(id: "5d011496534a13a13b2dff32") {
          name
          items(start_date: "8/31/2022", end_date: "8/31/2022") {
            product {
              name
            }
          }
        }
    `;

  // Fetch request from the GraphQL Api for requesting the data
  fetch(
    `${GraphQLAPI}${month}%2F${day}%2F${year}%22%2C%20end_date%3A%20%22${month}%2F${day}%2F${year}%22)%20%7B%0A%20%20%20%20%20%20product%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20site1%3A%20menuType(id%3A%20%225d011496534a13a13b2dff32%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20items(start_date%3A%20%22${month}%2F${day}%2F${year}%22%2C%20end_date%3A%20%22${month}%2F${day}%2F${year}%22)%20%7B%0A%20%20%20%20%20%20product%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let breakfastUnfiltered = data.data.site0.items; // stores the unfiltered array for breakfast menu
      let lunchUnfiltered = data.data.site1.items; // stores the unfiltered array for lunch menu

      let breakfastObjSize = Object.keys(breakfastUnfiltered).length; // gets the object size for breakfast menu
      let lunchObjSize = Object.keys(lunchUnfiltered).length; // gets the object size for the lunch menu

      // deletes "or" from breakfast Object
      for (let i = 0; i < breakfastObjSize; i++) {
        let breakfastItemName = data.data.site0.items[i].product.name;
        if (breakfastItemName == "or") {
          delete data.data.site0.items[i];
        }
      }

      // removes empty items from breakfast array
      const breakfastFiltered = breakfastUnfiltered.filter((a) => a);

      // deletes "or" from lunch Object
      for (let i = 0; i < lunchObjSize; i++) {
        let lunchItemName = data.data.site1.items[i].product.name;
        if (lunchItemName == "or") {
          delete data.data.site1.items[i];
        }
      }

      // removes empty items from breakfast array
      const lunchFiltered = lunchUnfiltered.filter((a) => a);

      // stores and new and organized data
      const newData = {
        id: "1",
        breakfast: breakfastFiltered,
        lunch: lunchFiltered,
      };

      let deploymentReadyData = newData;
      updateDB(deploymentReadyData); // updateDB function to update the database with current menu
    });

  // used to get notified when the bot is ran
  fetch(DiscordWebHook, {
    method: "POST",
    body: '{"content" : "Food Menu bot just ran"}', // The data
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function updateDB(GraphQLData) {
  // update function deletes the current content inside the database and updates it with new food menu
  await fetch(url, { method: "DELETE" }).then(() => console.log(""));

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(GraphQLData),
  };

  await fetch(POSTReqURL, requestOptions)
    .then((response) => response.json())
    .then((data) => console.log("Food Menu Updated!"));
}

// Runs the main function
getGraphQLData();
