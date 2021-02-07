import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "../components/date";
import { getSortedPostsData } from "../../lib/posts";
import { motion } from "framer-motion";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const item = {
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
    },
  }),
  hidden: { opacity: 0, x: -100 },
};

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi, my name is Maisy and I do stuff sometimes</p>
      </section>
      <section>
        <h2>Blog</h2>
        <motion.ul
          className={utilStyles.list}
          initial="hidden"
          animate="visible"
        >
          {allPostsData.map(({ id, date, title }, i) => (
            <motion.li
              className={utilStyles.listItem}
              key={id}
              variants={item}
              custom={i}
            >
              <motion.div layoutId={`title-${id}`}>
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
              </motion.div>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </Layout>
  );
}
