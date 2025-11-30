from PIL import Image
import os

# Carpeta donde se ejecuta el script
folder_path = os.getcwd()

# Recorremos todos los archivos en la carpeta
for filename in os.listdir(folder_path):
    if filename.lower().endswith(".png"):
        file_path = os.path.join(folder_path, filename)
        
        # Abrimos la imagen
        with Image.open(file_path) as img:
            # Convertimos a RGBA por si no tiene canal alfa
            img = img.convert("RGBA")
            
            # Usamos getbbox para obtener el "bounding box" sin transparencia
            bbox = img.getbbox()
            if bbox:
                # Recortamos la imagen
                cropped_img = img.crop(bbox)
                
                # Sobrescribimos la imagen original
                cropped_img.save(file_path)
                
                print(f"Recortada: {filename}")
            else:
                print(f"No se recortó (imagen vacía?): {filename}")

print("Proceso finalizado.")
