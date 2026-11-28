import time, numpy as np, soundfile as sf, torch
from omnivoice.models.omnivoice import OmniVoice, OmniVoiceGenerationConfig
torch.set_num_threads(4)
RT = {'preso': "A un preso le ofrecieron la libertad antes de tiempo. Y le suplicó al juez que le dejara dentro. Toda la sala se partió de risa. El juez se encogió de hombros: «Vale. Cinco años más».",
      'poker': "Un hombre lleva treinta años perdiendo al póker… a propósito. Esta noche le han tocado cinco cartas perfectas: escalera de color. Y las tira a la mesa sin enseñarlas. Sus tres amigos se reparten el bote, como todos los viernes."}
TXT = ("En esta discoteca solo dejan entrar a los feos. Y es la que más dinero gana de la ciudad. "
       "El portero tiene una norma… y no se la cuenta a nadie. Te mira de arriba abajo y te señala: pasa. Al siguiente: fuera.")
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
for name, ref, seed, sp, tmp, gs in [('c_poker1', 'poker', 21, .92, .8, 2.0), ('c_poker2', 'poker', 22, .92, .8, 2.0), ('d_preso1', 'preso', 23, .92, .8, 1.5)]:
    torch.manual_seed(seed); t = time.time()
    cfg = OmniVoiceGenerationConfig(num_step=64, class_temperature=tmp, guidance_scale=gs)
    a = np.asarray(m.generate(text=TXT, language="es", ref_audio=f"refs/{ref}.wav", ref_text=RT[ref], speed=sp, generation_config=cfg)[0], np.float32).squeeze()
    sf.write(f"{name}.wav", a, 24000); print(name, round(time.time() - t), 's', round(len(a) / 24000, 2), flush=True)
