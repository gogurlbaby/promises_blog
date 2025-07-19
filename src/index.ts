type User = {
  id: number;
  name: string;
};

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Comments = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

// Function to fetch the list of usera from API
const fetchUsers = async (): Promise<void> => {
  const apiUrl = "https://jsonplaceholder.typicode.com/users/";

  try {
    // Sending a GET request to fetch all users
    // No need to use method, body and headers for GET because that is the default fetch method
    const res = await fetch(apiUrl);

    // Convert the response body from JSON string to a JavaScript object or array
    const data: User[] = await res.json();

    // Get only the first five users from the list
    const firstFiveUsers = data.slice(0, 5);
    console.log("Fetching first five users", firstFiveUsers);

    // Call fetchPost and pass first 5 users to fetch and group their posts
    // To work on: Await the results
    await fetchPost(firstFiveUsers);
  } catch (error) {
    console.log("Error fetching users", error);
  }
};

// Function to fetch posts and group them by each of the first 5 users
const fetchPost = async (firstFiveUsers: User[]) => {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts/";

  try {
    // Fetch all posts from API
    const res = await fetch(apiUrl);
    const post: Post[] = await res.json();

    // Get the user IDs of the first 5 users
    const userIds = firstFiveUsers.map((user) => user.id);

    // Filter all posts in order to keep posts written by first 5 users
    const filteredPosts = post.filter((post) => userIds.includes(post.userId));

    const blogContainer = document.getElementById("blog") as HTMLElement;
    blogContainer.textContent = "Loading blog content...";
    // Clear it when done
    blogContainer.textContent = "";

    // To go through each of the 5 users one by one
    for (const user of firstFiveUsers) {
      // To creaate container for each author
      const authorDiv = document.createElement("div");
      authorDiv.className = "author";

      // To add author's name
      const authorName = document.createElement("h2");
      authorName.textContent = user.name;

      // To create a list of the authors' posts
      const postList = document.createElement("ul");

      const postByUser = filteredPosts.filter(
        (post) => post.userId === user.id
      );

      for (const post of postByUser) {
        const postItem = document.createElement("li");

        // Create Title of Post
        const postTitle = document.createElement("div");
        postTitle.className = "title";
        postTitle.textContent = post.title;

        // Create Body of post
        const postBody = document.createElement("div");
        postBody.className = "preview";
        postBody.textContent = post.body;

        // Fetch comments for each post
        const commentRes = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
        );
        const comments: Comments[] = await commentRes.json();

        const commentsHeader = document.createElement("p");
        commentsHeader.textContent = "💬 Comments:";
        commentsHeader.style.margin = "0.6rem 0 0.3rem";
        commentsHeader.style.fontWeight = "bold";
        postItem.appendChild(commentsHeader);

        //  Create Comments of post
        const commentList = document.createElement("ul");
        commentList.className = "comment-list";

        //  Loop and append comment body
        comments.forEach((comments) => {
          const commentItem = document.createElement("li");
          commentItem.innerHTML = `<strong>${comments.name}:</strong> ${comments.body}`;
          commentList.appendChild(commentItem);
        });

        postItem.appendChild(postTitle);
        postItem.appendChild(postBody);
        postItem.appendChild(commentList);
        postList.appendChild(postItem);
      }

      // Append the name and post list to author's section
      authorDiv.appendChild(authorName);
      authorDiv.appendChild(postList);

      // Append author black to the blog container
      blogContainer?.appendChild(authorDiv);
    }
  } catch (error) {
    console.log("Error fetching posts", error);
  }
  implementPagination();
};

function implementPagination(): void {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination";

  const blogContainer = document.getElementById("blog") as HTMLElement;
  const authors = Array.from(blogContainer.querySelectorAll(".author"));
  const authorsPerPage = 2;
  let currentPage = 1;

  const paginationControls = document.createElement("div");
  paginationControls.id = "pagination-controls";
  paginationControls.style.textAlign = "center";
  paginationControls.style.marginTop = "2rem";

  paginationContainer.appendChild(paginationControls);
  blogContainer.after(paginationContainer);

  function showPage(page: number) {
    const start = (page - 1) * authorsPerPage;
    const end = start + authorsPerPage;

    authors.forEach((el, i) => {
      (el as HTMLElement).style.display =
        i >= start && i < end ? "block" : "none";
    });

    renderControls(page);
  }

  function renderControls(page: number) {
    const totalPages = Math.ceil(authors.length / authorsPerPage);
    paginationControls.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⏮ Prev";
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => showPage(--currentPage);

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next ⏭";
    nextBtn.disabled = page === totalPages;
    nextBtn.onclick = () => showPage(++currentPage);

    const pageLabel = document.createElement("span");
    pageLabel.textContent = ` Page ${page} of ${totalPages} `;
    pageLabel.style.margin = "0 1rem";

    paginationControls.appendChild(prevBtn);
    paginationControls.appendChild(pageLabel);
    paginationControls.appendChild(nextBtn);
  }

  showPage(currentPage);
}

fetchUsers();
