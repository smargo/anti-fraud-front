// 通用的 request 函数
export const request = async (url: string, options: any = {}) => {
  const { method = 'GET', data, params, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  let requestUrl = url;
  if (params && method === 'GET') {
    const searchParams = new URLSearchParams(params);
    requestUrl += `?${searchParams}`;
  }

  try {
    const response = await fetch(requestUrl, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

