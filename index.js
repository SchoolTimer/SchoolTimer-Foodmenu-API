import fetch from "node-fetch";

const POSTReqURL =
  "https://6266b23763e0f3825685c4a6.mockapi.io/LunchBreakfastAPI/";
const url = "https://6266b23763e0f3825685c4a6.mockapi.io/LunchBreakfastAPI/1";

function getGraphQLData() {
  
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

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
  fetch(
    `https://api.isitesoftware.com/graphql?query=%7B%0A%20%20site0%3A%20menuType(id%3A%20%225d13bb11534a134661b51588%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20items(start_date%3A%20%22${month}%2F${day}%2F${year}%22%2C%20end_date%3A%20%22${month}%2F${day}%2F${year}%22)%20%7B%0A%20%20%20%20%20%20product%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20site1%3A%20menuType(id%3A%20%225d011496534a13a13b2dff32%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20items(start_date%3A%20%22${month}%2F${day}%2F${year}%22%2C%20end_date%3A%20%22${month}%2F${day}%2F${year}%22)%20%7B%0A%20%20%20%20%20%20product%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A`,
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
      let data1 = data;
      let deploymentReadyData = { id: "1", data1 };
      del();
      submit(deploymentReadyData);
    });
}

getGraphQLData();

async function del() {
  fetch(url, { method: "DELETE" }).then(() =>
    console.log("Successfully deleted")
  );
}

async function submit(GraphQLData) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(GraphQLData),
  };
  fetch(POSTReqURL, requestOptions)
    .then((response) => response.json())
    .then((data) => console.log(data.id));
}
