const API_URL = import.meta.env.WP_API_URL;

async function fetchAPI(query, { variables, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const username = import.meta.env.WP_PREVIEW_USER;
    const appPassword = import.meta.env.WP_PREVIEW_APP_PASSWORD;
    const token = Buffer.from(`${username}:${appPassword}`).toString("base64");
    headers.Authorization = `Basic ${token}`;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: auth ? "no-store" : "default",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `WPGraphQL request failed: ${res.status} ${res.statusText}\n${text}`,
    );
  }

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}

export async function getPrimaryMenu() {
  const data = await fetchAPI(`
    {
      menus(where: { location: HEADER_MENU }) {
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

  return data?.menus?.nodes?.[0]?.menuItems?.nodes ?? [];
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
      pages(where: { notIn: "cG9zdDo4" }) {
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
  const data = await fetchAPI(
    `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
      }
    }
    `,
    {
      variables: { slug },
    },
  );

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
      posts(first: 200, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
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

  return data?.posts?.nodes ?? [];
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(
    `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        slug
        categories {
          nodes {
            name
          }
        }
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
    `,
    {
      variables: { slug },
    },
  );

  return data?.post;
}

export async function getPreviewPostByDatabaseId(databaseId) {
  const data = await fetchAPI(
    `
    query GetPreviewPost($id: ID!) {
      post(id: $id, idType: DATABASE_ID) {
        databaseId
        slug
        title
        content
        featuredImage {
          node {
            filePath
          }
        }
        categories {
          nodes {
            name
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
    `,
    {
      variables: { id: databaseId },
      auth: true,
    },
  );

  return data?.post;
}

export async function testAuth() {
  const data = await fetchAPI(
    `
    {
      viewer {
        databaseId
        name
      }
    }
    `,
    { auth: true },
  );

  return data;
}
