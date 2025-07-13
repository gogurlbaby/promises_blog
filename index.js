// Function to fetch the list of usera from API
const fetchUsers = async () => {
  const apiUrl = "https://jsonplaceholder.typicode.com/users/";

  try {
    // Sending a GET request to fetch all users
    // No need to use method, body and headers for GET because that is the default fetch method
    const res = await fetch(apiUrl);

    // Convert the response body from JSON string to a JavaScript object or array
    const data = await res.json();

    // Get only the first five users from the list
    const firstFiveUsers = data.slice(0, 5);
    console.log("Fetching first five users", firstFiveUsers);

    // Call fetchPost and pass first 5 users to fetch and group their posts
    fetchPost(firstFiveUsers);
  } catch (error) {
    console.log("Error fetching users", error);
  }
};

// Function to fetch posts and group them by each of the first 5 users
const fetchPost = async (firstFiveUsers) => {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts/";

  try {
    // Fetch all posts from API
    const res = await fetch(apiUrl);
    const post = await res.json();

    // Get the user IDs of the first 5 users
    const userIds = firstFiveUsers.map((user) => user.id);

    // Filter all posts in order to keep posts written by first 5 users
    const filteredPosts = post.filter((post) => userIds.includes(post.userId));

    // filteredPosts.map((post) => {
    //   const author = firstFiveUsers.find((user) => user.id === post.userId);
    //   console.log(`Author: ${author.name}, Title: ${post.title}`);
    // });

    // To go through each of the 5 users one by one
    firstFiveUsers.forEach((user) => {
      console.log(`\nAuthor: ${user.name}`);
      const postByUser = filteredPosts.filter(
        (post) => post.userId === user.id
      );
      // For each user, get the posts that belongs to them
      postByUser.forEach((post) => {
        console.log(`- ${post.title}`);
      });
    });
  } catch (error) {
    console.log("Error fetching posts", error);
  }
};

fetchUsers();
