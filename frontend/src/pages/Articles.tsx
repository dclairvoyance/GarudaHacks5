import React, { useState, useEffect } from "react";
import axios from "axios";

interface Article {
  title: string;
  link: string;
  snippet: string;
  image: string;
}

async function fetchNews(): Promise<Article[]> {
  const apiKey =
    "6790a17acf5e76fef8e6608c0767fff189888fde1efa3c35be34dc70ca566ee1";

  const params = {
    engine: "google_news",
    api_key: apiKey,
    q: "scholarship",
  };

  try {
    const response = await axios.get(`https://serpapi.com/search.json`, {
      params,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      setError(false);
      const fetchedArticles = await fetchNews();
      setArticles(fetchedArticles);
      setLoading(false);
    };

    getArticles();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-7xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Articles</h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && (
          <p className="text-center text-red-500">Error loading articles</p>
        )}
        {!loading && !error && (
          <ul>
            {articles.map((article, index) => (
              <li key={index} className="mb-4">
                <a href={article.link} className="text-blue-500 font-semibold">
                  {article.title}
                </a>
                <p>{article.snippet}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Articles;
