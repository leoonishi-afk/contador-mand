import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedGradientText } from "./components/ui/animated-gradient-text";
import { NumberTicker } from "./components/ui/number-ticker";
import { ConfettiButton } from "./components/ui/confetti";
import { SmoothCursor } from "./components/ui/smooth-cursor";

import confetti from "canvas-confetti"
// Ajuste os imports conforme o path gerado pelo shadcn

// ================= CONFIG =================
const DATA_FIM = new Date("2028-12-31T23:59:59");
// ==========================================


function getTimeRemaining(targetDate: Date) {
  const total = targetDate.getTime() - new Date().getTime();

  const seconds = Math.max(0, Math.floor((total / 1000) % 60));
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60));
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24));
  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)));

  return { total, days, hours, minutes, seconds };
}

function FlipCard({
  front,
  back,
}: {
  front: string;
  back: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="
        w-full 
        max-w-[95%] sm:max-w-xl md:max-w-4xl 
        h-[90px] sm:h-[120px] md:h-[160px] 
        z-10 mx-auto
        mb-10
        sm:mb-5
        md:mb-0
      "
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((prev) => !prev)} // 👈 mobile principal
      onMouseEnter={() => setFlipped(true)} // desktop
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRENTE */}
        <div
          className="
            absolute w-full h-full flex items-center justify-center
            rounded-2xl md:rounded-3xl
            bg-gradient-to-r from-zinc-900 via-black to-zinc-900
            border border-white/10
            shadow-xl
            px-3 sm:px-6
            text-sm sm:text-lg md:text-3xl
            font-black text-center leading-tight
          "
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {front}
        </div>

        {/* VERSO */}
        <div
          className="
            absolute w-full h-full flex items-center justify-center
            rounded-2xl md:rounded-3xl
            bg-gradient-to-r from-purple-600 to-pink-600
            px-3 sm:px-6
            text-sm sm:text-lg md:text-3xl
            font-black text-center leading-tight
          "
          style={{
            transform: "rotateX(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}



export default function ContadorMandato() {
  const [time, setTime] = useState(getTimeRemaining(DATA_FIM));
  const [animationKey, setAnimationKey] = useState(0);
const handleClick = () => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })
      requestAnimationFrame(frame)
    }
    frame()
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const t = getTimeRemaining(DATA_FIM);
      setTime(t);

      if (t.days % 100 === 0 || t.days % 10 === 0 || t.days === 365) {
        setAnimationKey((prev) => prev + 1);
      }

      if (t.days <= 90) {
        setAnimationKey((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isFinal = time.days <= 90;

  const mensagem = useMemo(() => {
    if (time.days <= 0) return "ACABOOOOOOU, NÃO AGUENTAVA MAIS 🎉";
    if (isFinal) return "🔥 TÁ ACABANDO HEIN 🔥";
    return "⏳ CONTAGEM PARA O FIM DO MUNDO";
  }, [time.days]);

  return (
    <div
      className={`min-h-screen min-w-screen flex flex-col items-center cursor-none justify-start text-white px-4 overflow-hidden relative
      ${isFinal ? "bg-black" : "bg-black"}`}
    >
      <SmoothCursor />
      {/* BACKGROUND PREMIUM */}
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] bg-purple-600 rounded-full blur-[200px] opacity-20 top-[-200px] left-[-200px]" />
        <div className="absolute w-[600px] h-[600px] bg-pink-600 rounded-full blur-[200px] opacity-20 bottom-[-150px] right-[-150px]" />
      </div>

      {/* TÍTULO */}
      <motion.div className="flex mt-24 mb-6 z-10">
        <AnimatedGradientText className="text-4xl md:text-6xl font-black text-center">
          {mensagem}
        </AnimatedGradientText>
      </motion.div>

      {/* PLACA FLIP 🔥 */}
      <div onClick={handleClick} className="relative w-full flex justify-center  px-4">
      
        <FlipCard
          front=""
          back="🔥 Digo: Mandato 🔥"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center w-full">
        {/* CONTADOR */}

        <div className="grid grid-cols-1 gap-19 sm:grid-cols-1 md:grid-cols-4 md:gap-2 w-full max-w-6xl justify-items-center z-10">

          <ConfettiButton>
            <TimeBox label="DIAS" value={time.days} highlight />
          </ConfettiButton>

          <ConfettiButton>
            <TimeBox label="HORAS" value={time.hours} />
          </ConfettiButton>

          <ConfettiButton>
            <TimeBox label="MIN" value={time.minutes} />
          </ConfettiButton>

          <ConfettiButton>
            <TimeBox label="SEG" value={time.seconds} />
          </ConfettiButton>

        </div>

        {/* FRASES */}
        <div className="mt-10  md:mt-24">
          <MemePhrase days={time.days} />
        </div>

        {/* ANIMAÇÕES */}
        <AnimatePresence>
          <SpecialAnimation key={animationKey} days={time.days} />
        </AnimatePresence>
      </div >
    </div >
  );
}

function TimeBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      className={`
        w-[250px] sm:w-[250px] md:w-[250px]
        p-4 md:p-6
        rounded-3xl
        text-center
        backdrop-blur-xl
        border border-white/10
        shadow-2xl
        ${highlight ? "bg-gradient-to-br from-purple-600 to-pink-600" : "bg-white/5"}
      `}
    >
      <div className="relative">
        <div
          className={`
              font-extrabold
              text-white
              ${highlight
              ? "text-5xl sm:text-6xl md:text-7xl"
              : "text-3xl sm:text-4xl md:text-5xl"}
  `}
        >
          <NumberTicker  value={value} />
        </div>
        <div className="text-xs mt-2 tracking-widest opacity-70 text-white">{label}</div>
      </div>
    </motion.div>
  );
}

function MemePhrase({ days }: { days: number }) {
  const frases = [
    "👀 Tá demorando hein...",
    "⏳ Contando até o fim...",
    "😅 Já pode ir arrumando as malas",
    "🔥 O tempo não para!",
    "📉 Popularidade em queda...",
    "🤡 Já tá virando série isso aqui",
    "🕰️ Cada segundo é uma vitória",
    "📆 Agenda aberta pro último dia?",
    "😬 Climinha de despedida no ar...",
    "🚪 A porta já tá ali ó...",
    "📦 Já separou as caixas da mudança?",
    "👋 Vai deixar saudade? 🤔",
    "🎭 Últimos capítulos dessa novela...",
    "⏱️ O cronômetro não perdoa",
    "🔥 A contagem tá ficando séria..."
  ];

  const finalFrases = [
    "🚨 AGORA É PRA VALER",
    "🔥 ÚLTIMA VOLTA DO RELÓGIO",
    "💀 ACABOU A PACIÊNCIA",
  ];

  const getRandomPhrase = () => {
    const lista = days <= 90 ? finalFrases : frases;
    return lista[Math.floor(Math.random() * lista.length)];
  };

  const [frase, setFrase] = useState(getRandomPhrase());

  useEffect(() => {
    // troca a cada 4 horas
    const interval = setInterval(() => {
      setFrase(getRandomPhrase());
    }, 4 * 60 * 11); // 4h

    return () => clearInterval(interval);
  }, [days]);


  return (
    <motion.div
      key={frase}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-10 text-center text-lg opacity-80 z-10"
    >
      {frase}
    </motion.div>
  );
}

function SpecialAnimation({ days }: { days: number }) {
  let text = "";

  if (days <= 0) {
    text = "🎉 FIM DO MANDATO 🎉";
  } else if (days <= 90) {
    text = "🚨 CONTAGEM FINAL 🚨";
  } else if (days % 100 === 0) {
    text = `💯 ${days} DIAS`;
  } else if (days % 10 === 0) {
    text = `🔟 ${days} DIAS`;
  } else if (days === 365) {
    text = "📅 1 ANO RESTANTE";
  }

  if (!text) return null;

  return (
    <motion.div
      className="fixed bottom-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-5 rounded-3xl text-2xl font-black shadow-2xl z-20"
    >
      {text}
    </motion.div>
  );
}
