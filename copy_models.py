import shutil
import os

src = r"c:\Users\Sanjeev\OneDrive\Desktop\pendrive\Project\clinical diagonisis\psyscan\model"
dst = r"c:\Users\Sanjeev\OneDrive\Desktop\DiagnosticProject\ml_models"

for filename in os.listdir(src):
    if filename.endswith(".pkl") or filename.endswith(".h5"):
        src_path = os.path.join(src, filename)
        dst_path = os.path.join(dst, filename)
        print(f"Copying {src_path} to {dst_path}")
        shutil.copy2(src_path, dst_path)
print("Done!")
