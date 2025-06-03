"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Card, CardBody, CardHeader, Link, Tag } from "@chakra-ui/react";
import parse from "html-react-parser";
import { useTranslations } from "next-intl";
import { HelpArticleDetail } from "../actions";
import style from "@/app/[locale]/_components/microCms/style.module.css";
import { getQueryString } from "./utils";

export default function HelpArticleDetailPane({
  detail,
  initialPlatform,
  initialPlan,
  initialKeyword,
}: {
  initialPlatform?: string;
  initialPlan?: string;
  initialKeyword?: string;
  detail: HelpArticleDetail;
}) {
  const t = useTranslations("Help");
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes("#")) {
      const id = router.asPath.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [router.asPath]);

  return (
    <>
      <Box
        style={{
          margin: "30px auto",
          width: "900px",
        }}
      >
        <Link
          href={`/help${getQueryString(initialPlatform, initialPlan, initialKeyword)}`}
          style={{ color: "#0077cc", textDecoration: "underline" }}
        >
          {t("backToArticles")}
        </Link>
        {detail && (
          <Card
            style={{
              marginTop: "10px",
              padding: "20px 40px",
              width: "900px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <CardHeader borderBottom={"solid 1px #EEE"}>
              <h1 style={{ fontSize: "2.2em", lineHeight: "1.2em" }}>
                {detail.title}
              </h1>
              <p style={{ marginTop: "1.0em" }}>
                {detail.tags.map((tag, idx) => {
                  return (
                    <Tag key={idx} colorScheme="blue" marginRight={"3px"}>
                      {tag.name}
                    </Tag>
                  );
                })}
              </p>
            </CardHeader>
            <CardBody>
              <div className={style.MICROCMS_CONTENT}>
                {parse(detail.content)}
              </div>
            </CardBody>
          </Card>
        )}
      </Box>
    </>
  );
}
