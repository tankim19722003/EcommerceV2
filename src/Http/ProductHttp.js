export async function fetchData(url) {

  const response = await fetch(url);
  // console.log(url);
  const resData = await response.json();
  // console.log(resData);

  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }

  return resData.productRatingOrderResponses;
}