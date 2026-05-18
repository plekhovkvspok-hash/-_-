const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1xsd_YD_1k_SOgBm8LtvE9DUrTtvRwIlmwrj5_n2jUxQ/export?format=csv&gid=2111248717';

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: '',
    };
  }

  try {
    const response = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!response.ok) {
      return jsonResponse(502, { error: `Google Sheets returned HTTP ${response.status}` });
    }

    const csv = await response.text();
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
      body: csv,
    };
  } catch (error) {
    return jsonResponse(502, { error: error.message || 'Unable to load Google Sheets CSV' });
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
    body: JSON.stringify(payload),
  };
}
