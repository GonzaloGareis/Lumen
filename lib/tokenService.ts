export async function exchangeToken(host: string, clerkToken: string) {

    try {
        // Choose protocol based on environment
        const protocol = host?.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;
        const tokenExchangeUrl = `${baseUrl}/api/token`;
    
        const exchangeResponse = await fetch(tokenExchangeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: clerkToken }),
          credentials: "include"
        });
    
        if (!exchangeResponse.ok) {
          const err = await exchangeResponse.json();
          throw new Error(err.error || "Token exchange failed");
        }
        
        const { token: supabaseToken } = await exchangeResponse.json();
        
        return supabaseToken;
    
      } catch (error) {
        return new Response(
          JSON.stringify({ error: (error as Error).message }),
          { status: 500 }
        );
      }
}