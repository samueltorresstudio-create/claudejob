# bloque largo de un tirón (el modelo pone las pausas), con los tonos del 76
import json, time, numpy as np, soundfile as sf, torch
from omnivoice.models.omnivoice import OmniVoice, OmniVoiceGenerationConfig
torch.set_num_threads(4); R = json.load(open('../voz75/refs/refs.json'))
TXT = ("Compras un plátano por seis millones de dólares. Y te lo comes. Todo empieza en Miami, en dos mil diecinueve. "
       "En una pared blanca, un plátano pegado con cinta americana. Cuesta ciento veinte mil dólares. Crees que es una broma. "
       "¿Es de oro? ¡No! ¿Lo hizo un genio? ¡No! Es un plátano. Y se venden dos.")
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
for name, ref, seed, sp in [('narr', 'narr', 1, 1.05), ('plan', 'plan', 2, 1.05), ('alegre', 'alegre', 3, 1.05)]:
    torch.manual_seed(seed); t = time.time()
    cfg = OmniVoiceGenerationConfig(num_step=64, class_temperature=.3)
    a = np.asarray(m.generate(text=TXT, language="es", ref_audio=f"../voz75/refs/{ref}.wav", ref_text=R[ref], speed=sp, generation_config=cfg)[0], np.float32).squeeze()
    sf.write(f"bloque_{name}.wav", a, 24000); print(name, round(time.time() - t), 's', round(len(a) / 24000, 2), flush=True)
