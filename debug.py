import subprocess
try:
    with open("error.txt", "w", encoding="utf-8") as f:
        f.write(subprocess.check_output(['python', 'manage.py', 'check'], stderr=subprocess.STDOUT).decode('utf-8'))
except subprocess.CalledProcessError as e:
    with open("error.txt", "w", encoding="utf-8") as f:
        f.write(e.output.decode('utf-8', errors='replace'))
