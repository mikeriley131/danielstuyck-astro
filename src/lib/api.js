import dotenv from "dotenv";
dotenv.config();
const API_URL = process.env.WP_API_URL;

async function fetchAPI(query, { variables } = {}) {
  const headers = { "Content-Type": "application/json" };
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}

export async function getPrimaryMenu() {
  const data = await fetchAPI(`
    {
      menus(where: {location: HEADER_MENU}) {
        nodes {
          menuItems {
            nodes {
              label
              path
            }
          }
        }
      }
    }
  `);
  return data?.menus?.nodes[0]?.menuItems?.nodes;
}

export async function getAllCategoriesWithSlugs() {
  const data = await fetchAPI(`
  {
    categories {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);
  return data?.categories;
}

export async function getAllPagesWithSlugs() {
  const data = await fetchAPI(`
  {
    pages(where: {notIn: "cG9zdDo4"}) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);
  return data?.pages;
}

export async function getPageBySlug(slug) {
  const data = await fetchAPI(`
  {
    page(id: "${slug}", idType: URI) {
      title
      content
    }
  }
  `);
  return data?.page;
}

export async function getAllPostsWithSlugs() {
  const data = await fetchAPI(`
  {
    posts(first: 200) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);
  return data?.posts;
}

export async function getAllPosts() {
  const data = await fetchAPI(`
  {
    posts(first: 200, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
      nodes {
      title
      categories {
        nodes {
          name
        }
      }
      slug
      featuredImage {
        node {
          filePath
        }
      }
      portfolioItemFields {
        portfolioAwards
        portfolioDirectors
        portfolioImages {
          portfolioImage {
            node {
              filePath(size: LARGE)
            }
          }
        }
        portfolioRole
        previewText
      }
    }
    }
  }
  `);
  return data?.posts.nodes;
}
