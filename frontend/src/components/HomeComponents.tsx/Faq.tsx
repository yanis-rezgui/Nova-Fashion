import { memo, useState } from "react"
import {motion, AnimatePresence} from "framer-motion"


const Faq = () => {

    const [openIndex, setOpenIndex] = useState<number>(0);
    
const faq = [
    {
        question: "Comment passer une commande ?",
        answer:
            "Parcourez notre boutique, choisissez l'article qui vous plaît, sélectionnez les options disponibles puis ajoutez-le à votre panier. Il vous suffit ensuite de renseigner vos informations et de confirmer votre commande.",
    },
    {
        question: "Quels sont les moyens de paiement disponibles ?",
        answer:
            "Le paiement s'effectue à la livraison. Vous réglez votre commande directement lors de la réception de votre colis.",
    },
    {
        question: "Quels sont les délais de livraison ?",
        answer:
            "Les commandes sont préparées rapidement puis remises au service de livraison. Le délai peut varier selon votre lieu de livraison. Pour connaître les conditions applicables à votre commande, contactez notre support client.",
    },
    {
        question: "Livrez-vous partout en Algérie ?",
        answer:
            "Nous proposons la livraison à différentes wilayas d'Algérie. Les frais et les délais de livraison peuvent varier selon votre zone géographique.",
    },
    {
        question: "Puis-je modifier ou annuler ma commande ?",
        answer:
            "Si votre commande n'a pas encore été préparée ou expédiée, contactez-nous rapidement afin que nous puissions vérifier s'il est encore possible de la modifier ou de l'annuler.",
    },
    {
        question: "Puis-je échanger un article ?",
        answer:
            "Oui, un échange peut être possible selon les conditions prévues par Nova Fashion. Contactez notre support client avant de retourner votre article afin de connaître la procédure à suivre.",
    },
    {
        question: "Comment choisir ma taille ?",
        answer:
            "Nous vous recommandons de consulter les informations de taille disponibles sur la fiche du produit. Si vous avez un doute, notre équipe peut également vous aider à choisir la taille la plus adaptée.",
    },
    {
        question: "Comment suivre ma commande ?",
        answer:
            "Une fois votre commande prise en charge, les informations disponibles concernant sa livraison vous seront communiquées. Vous pouvez également contacter notre support client pour obtenir des informations sur son état.",
    },
    {
        question: "Que faire si je reçois un article incorrect ou endommagé ?",
        answer:
            "Contactez notre support client dès que possible en précisant le problème rencontré. Notre équipe vous indiquera les étapes à suivre afin de trouver une solution.",
    },
    {
        question: "Comment contacter Nova Fashion ?",
        answer:
            "Vous pouvez utiliser notre formulaire de contact pour nous envoyer votre demande. Notre équipe vous répondra dans les meilleurs délais.",
    },
];



    return(
        <section className="flex flex-col w-full py-10 px-10 justify-center items-center gap-2 bg-gray-100">

            <p
                className="
                    text-[#B89B72]
                    text-[30px]
                    font-semibold
                    tracking-[0.25em]
                    uppercase
                "
            >
               FAQ
            </p>


            <h2
                className="
                    text-center
                    text-[2em]
                    text-gray-900
                    font-bold
                "
            >
                Les réponses à vos questions.
            </h2>

                  <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex flex-col mt-10 mb-5"
      >
        {faq.map((faq, index) => (
          <motion.div
            key={index}
            
            transition={{ duration: 0.2 }}
            className="bg-white w-[700px] shadow-xl max-[750px]:w-[300px]"
          >
            <button
              className="w-full text-left px-5 py-4 font-medium flex justify-between items-center text-[#172033]"
              onClick={() =>
                setOpenIndex(openIndex === index ? -1 : index)
              }
            >
              <span>{faq.question}</span>

              <motion.span
                animate={{
                  rotate: openIndex === index ? 45 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="text-[1.8em] font-light ml-4"
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600 px-5 pb-5 leading-6">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
        </section>
    )
}

export default memo(Faq);