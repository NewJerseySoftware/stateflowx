export interface ClientProtocol {
  type: string;
}

export function jsonRpc(): ClientProtocol {
  return {
    type: 'json-rpc',
  };
}
