# narración completa del 78: SU voz (ref «poker», 71), ritmo de la ref .99. Bloques de 4–6 frases de un tirón, 2 tomas por bloque.
import time, json, numpy as np, soundfile as sf, torch
from omnivoice.models.omnivoice import OmniVoice, OmniVoiceGenerationConfig
torch.set_num_threads(4)
REF = "Un hombre lleva treinta años perdiendo al póker… a propósito. Esta noche le han tocado cinco cartas perfectas: escalera de color. Y las tira a la mesa sin enseñarlas. Sus tres amigos se reparten el bote, como todos los viernes."
B = [
 "En esta discoteca solo dejan entrar a los feos. Y es la que más dinero gana de la ciudad. El portero tiene una norma… y no se la cuenta a nadie. Te mira de arriba abajo y te señala: pasa. Al siguiente: fuera. El del gimnasio, con la camisa planchada: fuera. El del jersey de su abuela: dentro.",
 "Los de la competencia se reían: ¡te arruinas en un mes! Pero dentro, todos se sienten el más guapo de la sala. Bailan sin vergüenza, ligan como nunca… y vuelven cada sábado. Y gastan el doble. Uno, con su copa, pregunta: oye… ¿y yo por qué he entrado? Nadie le contesta.",
 "Fuera, los guapos se despeinan, se tuercen las gafas… uno se pinta un diente de negro. ¿Así valgo? Fuera. ¿Y por qué funciona? Se llama efecto contraste.",
 "Tu cerebro no mide lo guapo que eres: te compara con lo que tienes al lado. Unos psicólogos lo comprobaron: tras ver a gente guapísima, a una persona normal la puntuaban peor. ¿Nunca te has hecho una foto al lado de tu amigo más feo… para salir mejor? Pues esto, con una discoteca entera.",
 "La única vez que el portero dijo fuera sin pensarlo… fue a su propio reflejo. Porque en esta discoteca solo dejan entrar"]
json.dump(B, open('bloques.json', 'w'), ensure_ascii=False)
m = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map="cpu", dtype=torch.float32)
for i, txt in enumerate(B):
    for k, seed in enumerate((31 + i * 7,)):
        import os
        if os.path.exists(f'b{i}_{k}.wav'): continue
        torch.manual_seed(seed); t = time.time()
        cfg = OmniVoiceGenerationConfig(num_step=64, class_temperature=.8, guidance_scale=2.0)
        a = np.asarray(m.generate(text=txt, language="es", ref_audio="refs/poker.wav", ref_text=REF, speed=.92, generation_config=cfg)[0], np.float32).squeeze()
        sf.write(f"b{i}_{k}.wav", a, 24000); print(f"b{i}_{k}", round(time.time() - t), 's', round(len(a) / 24000, 2), flush=True)
