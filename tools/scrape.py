import requests
import time

def fetch_proxies(page, max_retries=5):
    url = "https://proxylist.geonode.com/api/proxy-list"
    params = {
        "limit": 500,
        "page": page,
        "sort_by": "lastChecked",
        "sort_type": "desc"
    }

    retries = 0
    while retries < max_retries:
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            proxies = []
            for proxy in data.get("data", []):
                protocols = proxy.get("protocols", [])
                if not protocols:
                    continue
                protocol = protocols[0].lower()
                ip = proxy.get("ip")
                port = proxy.get("port")
                if protocol and ip and port:
                    proxies.append(f"{protocol}://{ip}:{port}")

            return proxies

        except requests.exceptions.HTTPError as e:
            if response.status_code == 503:
                wait = 2 ** retries  # exponential backoff: 1,2,4,8,16 seconds
                print(f"503 Server Unavailable on page {page}, retrying in {wait} seconds...")
                time.sleep(wait)
                retries += 1
            else:
                print(f"HTTP error on page {page}: {e}")
                break
        except requests.exceptions.RequestException as e:
            print(f"Request error on page {page}: {e}")
            break

    print(f"Failed to fetch page {page} after {max_retries} retries.")
    return []

def main():
    all_proxies = set()
    total_pages = 24

    for page in range(1, total_pages + 1):
        print(f"Fetching page {page}...")
        proxies = fetch_proxies(page)
        before_count = len(all_proxies)
        all_proxies.update(proxies)
        after_count = len(all_proxies)
        print(f"Added {after_count - before_count} new proxies.")

    with open("proxies.txt", "w") as f:
        for proxy in sorted(all_proxies):
            f.write(proxy + "\n")

    print(f"Scraped {len(all_proxies)} unique proxies into proxies.txt")

if __name__ == "__main__":
    main()

