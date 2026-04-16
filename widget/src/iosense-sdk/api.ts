const BASE_URL = 'https://connector.iosense.io/api';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function iosenseFetch<T = any>(
  path: string,
  authentication: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authentication,
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new Error(`IOsense API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function findUserDevices(
  authentication: string,
  searchTerm: string
): Promise<any[]> {
  try {
    const response = await iosenseFetch<any>(
      '/v2/userDevice/findUserDevices',
      authentication,
      {
        method: 'POST',
        body: {
          search: { all: [searchTerm] },
          project: { d: 1, 'dvT.dvTN': 1 },
          page: 1,
          count: 20,
        },
      }
    );
    return response?.data?.data ?? [];
  } catch {
    return [];
  }
}

export async function getDeviceMetadata(
  authentication: string,
  devID: string
): Promise<any[]> {
  try {
    const response = await iosenseFetch<any>(
      '/v2/device/getDeviceSpecificMetadata',
      authentication,
      {
        method: 'POST',
        body: { devID },
      }
    );
    return response?.data?.data ?? [];
  } catch {
    return [];
  }
}

export async function getWidgetData(
  authentication: string,
  body: Record<string, any>
): Promise<any> {
  try {
    const response = await iosenseFetch<any>(
      '/v2/masterData/getWidgetData',
      authentication,
      { method: 'POST', body }
    );
    return response?.data?.data ?? null;
  } catch {
    return null;
  }
}
