import sys, time, json, numpy as np, soundfile as sf, torch
from omnivoice.models.omnivoice import OmniVoice, OmniVoiceGenerationConfig
torch.set_num_threads(4)
REF = "En Japón te regalan casas. Y aun así, hay millones vacías. Entras en el akiya bank, la web de casas abandonadas. Tres habitaciones, en la montaña. Precio: cero yenes. Esto es una estafa. Pues no. Vas a verla. La puerta está abierta."
TXT = "Compras un plátano por seis millones de dólares… y te lo comes. Todo empieza en Miami, en dos mil diecinueve. En una pared blanca, un plátano pegado con cinta americana."
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
for name, ct, seed in [('a', .8, 1), ('b', .8, 2), ('c', .8, 3), ('d', 0.0, 4)]:
    torch.manual_seed(seed); t = time.time()
    cfg = OmniVoiceGenerationConfig(num_step=64, class_temperature=ct)
    a = np.asarray(m.generate(text=TXT, language="es", ref_audio="ref.wav", ref_text=REF, generation_config=cfg)[0], np.float32).squeeze()
    sf.write(f"take_{name}.wav", a, 24000); print(name, ct, round(time.time() - t), 's', round(len(a) / 24000, 2), flush=True)
