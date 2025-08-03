# CORS Configuration Guide

This project includes comprehensive CORS handling to avoid cross-origin issues when communicating with the backend API.

## Development Setup

### 1. Proxy Configuration
The Vite development server is configured with a proxy to handle CORS issues automatically:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://api.hackathon2025.ai.in.th/team06-1',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
}
```

### 2. Environment Variables
- **Development**: Uses `/api` (proxy)
- **Production**: Uses direct API URL

```bash
# .env (development)
VITE_API_BASE_URL=/api

# .env.production (production)
VITE_API_BASE_URL=https://api.hackathon2025.ai.in.th/team06-1
```

## Error Handling

The project includes robust error handling for CORS and network issues:

### API Error Types
- **CORS Errors**: Detected and handled with user-friendly messages
- **Network Errors**: Connection issues and timeouts
- **HTTP Errors**: Standard HTTP error responses

### Usage Example
```typescript
try {
  const result = await detectObjects(request);
  // Handle success
} catch (error) {
  // Error is automatically formatted with proper CORS messaging
  setError(error.message);
}
```

## Common CORS Issues & Solutions

### Issue 1: "CORS policy" error in browser
**Solution**: Use the development proxy by setting `VITE_API_BASE_URL=/api`

### Issue 2: Network errors in production
**Solution**: Ensure the backend has proper CORS headers:
```javascript
// Backend should include these headers:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

### Issue 3: Preflight OPTIONS requests failing
**Solution**: Backend must handle OPTIONS requests properly

## Testing CORS Configuration

1. **Development**: Start dev server and check browser network tab
2. **Production**: Deploy and test with different origins
3. **Cross-origin**: Test from different domains/ports

## Deployment Notes

When deploying:
1. Update `.env.production` with correct API URL
2. Ensure backend CORS configuration allows your domain
3. Test from deployed frontend to confirm CORS works

## Troubleshooting

### Check Browser Console
Look for CORS-related error messages:
- "blocked by CORS policy"
- "No 'Access-Control-Allow-Origin' header"

### Check Network Tab
- Look for OPTIONS preflight requests
- Verify response headers include CORS headers
- Check if requests are reaching the backend

### Backend Configuration
Ensure your backend includes proper CORS middleware and headers.
