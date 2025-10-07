// getDatoCmsToken.ts

const PRIMARY_HOSTS = [
  "localhost",
  "127.0.0.1",
  "::1",
  "mohammedazeezulla.com",
  "www.mohammedazeezulla.com",
  "portfolio.mohammedazeezulla.com",
];

export const getDatoCmsToken = (): string => {
  const hostname = window.location.hostname.toLowerCase();

  if (PRIMARY_HOSTS.includes(hostname)) {
    return process.env.REACT_APP_DATOCMS_ROR_TOKEN ?? "";
  }

  console.warn(
    `No DatoCMS token configured for hostname: ${hostname}. Falling back to the default token.`,
  );
  return process.env.REACT_APP_DATOCMS_ROR_TOKEN ?? "";
};
