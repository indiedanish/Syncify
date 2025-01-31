"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import MDEditor from "@uiw/react-md-editor";
import { Loader2, Sparkles, Save, Download } from "lucide-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { coverLetterSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { generateCoverLetter } from "@/actions/dashboard";

import { useRouter } from "next/navigation";
const GenerateCoverLetter = () => {
  const router = useRouter();

  const {
    loading: updateLoading,
    fn: generateCoverLetterFn,
    data: updateResult,
  } = useFetch(generateCoverLetter);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const onSubmit = async (values) => {
    try {
      await generateCoverLetterFn({
        ...values,
      });
    } catch (error) {
      console.error("Error occured while generating, try again! :", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Cover Letter has been generated successfully!");
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth", 
      });
    }
  }, [updateResult, updateLoading]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <div className="container mx-auto my-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Please provide the information about the job position you're
                applying
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="w-full">
                <Label>Company Name</Label>
                <Input
                  className="my-1"
                  onChange={(value) => {
                    setValue("companyName", value);
                  }}
                  id="companyName"
                  placeholder="Enter company name"
                  {...register("companyName")}
                ></Input>
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label>Job Title</Label>
                <Input
                  className="my-1"
                  onChange={(value) => {
                    setValue("jobTitle", value);
                  }}
                  id="jobTitle"
                  placeholder="Enter job title"
                  {...register("jobTitle")}
                ></Input>
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Job Description</Label>

              <Textarea
                onChange={(value) => {
                  setValue("jobDescription", value);
                }}
                id="jobDescription"
                placeholder="Paste the job description here..."
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Cover Letter
                </>
              )}
            </Button>
          </CardFooter>
        </form>
        {updateResult ? (
          <div className="py-5 space-x-2">
            <CardContent className="flex flex-col gap-3">
              <div className="w-full flex justify-end">
                {isGenerating ? (
                  <>
                    <Button variant="outline">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating PDF...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={generatePDF}
                      disabled={isGenerating}
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </>
                )}{" "}
              </div>

              <div id="resume-pdf">
                <MDEditor.Markdown
                  source={updateResult?.coverLetter}
                  style={{
                    background: "white",
                    color: "black",
                    padding: "10px",
                  }}
                />
              </div>
            </CardContent>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default GenerateCoverLetter;
