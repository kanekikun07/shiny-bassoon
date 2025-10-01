proxy_file = 'http.txt'

with open(proxy_file, 'r') as file:
    lines = file.readlines()

with open(proxy_file, 'w') as file:
    for line in lines:
        line = line.strip()
        if not (line.startswith('http://') or line.startswith('https://')):
            line = 'http://' + line
        file.write(line + '\n')

print(f"Updated {proxy_file} with 'http://' prefix where needed.")
