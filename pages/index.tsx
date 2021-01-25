import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "../components/date";
import { getSortedPostsData } from "../lib/posts";
import { motion } from "framer-motion";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

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
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <motion.div layoutId={`title-${id}`}>
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
              </motion.div>
              <br />
              <motion.small
                layoutId={`date-${id}`}
                className={utilStyles.lightText}
              >
                <Date dateString={date} />
              </motion.small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
