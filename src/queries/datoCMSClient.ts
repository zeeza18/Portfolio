import { GraphQLClient } from 'graphql-request';
import { getDatoCmsToken } from './getDatoCmsToken';

const DATO_CMS_ENDPOINT = 'https://graphql.datocms.com/';
const DATO_CMS_API_TOKEN = getDatoCmsToken();

export const hasDatoCmsCredentials = Boolean(DATO_CMS_API_TOKEN);

const datoCMSClient = hasDatoCmsCredentials
  ? new GraphQLClient(DATO_CMS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${DATO_CMS_API_TOKEN}`,
      },
    })
  : null;

export const requestDatoCMS = async <T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  if (!datoCMSClient) {
    throw new Error('DATOCMS_TOKEN_MISSING');
  }

  return datoCMSClient.request<T>(query, variables);
};

export default datoCMSClient;
