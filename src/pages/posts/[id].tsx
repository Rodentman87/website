import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { motion } from "framer-motion";

export default function FirstPost({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <motion.h1
          layoutId={`title-${postData.id}`}
          className={utilStyles.headingXl}
        >
          {postData.title}
        </motion.h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
