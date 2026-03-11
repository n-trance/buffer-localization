import { JobPageContent } from "./JobPageContent";
import styles from "@/app/journey/[slug]/page.module.css";

type Props = { params: Promise<{ slug: string }> };

export default async function JobPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className={styles.page}>
      <JobPageContent key={slug} />
    </div>
  );
}
