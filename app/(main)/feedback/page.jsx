"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { updateUserFeedback } from "@/actions/user";

import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();

  const [selectedRating, setSelectedRating] = useState(null);
  const [currHoveringOver, setCurrHoveringOver] = useState(null);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUserFeedback);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (values) => {
    try {
      await updateUserFn({
        ...values,
      });
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  const handleRatingChange = (rating) => {
    setValue("rating", rating);
    setSelectedRating(rating);
  };

  const isFilled = (num) => {
    if (num <= selectedRating || num <= currHoveringOver) {
      return "fill-primary";
    }
  };

  const handleHover = (num) => {
    setCurrHoveringOver(num);
  };
  const handleLeave = () => {
    setCurrHoveringOver(null);
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Feedback has been sent successfully!");
      router.push("/");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  return (
    <div className="container flex justify-center p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="gradient-title text-4xl">
              Provide your feedback
            </CardTitle>
            <CardDescription>
              Let us know what you think of this product by leaving a rating.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              onValueChange={(value) => {
                setValue("comment", value);
              }}
              id="comment"
              placeholder="Tell us your toughts..."
              {...register("comment")}
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="rating">Your rating:</Label>
              <RadioGroup
                aria-label="Rating"
                id="rating"
                className="flex items-center gap-2"
              >
                <RadioGroupItem
                  value="1"
                  id="rating-1"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rating-1"
                  className="cursor-pointer"
                  onMouseLeave={() => handleLeave()}
                  onMouseEnter={() => handleHover(1)}
                  onClick={() => handleRatingChange(1)}
                  title="1 star"
                >
                  <StarIcon className={`h-6 w-6 ${isFilled(1)}`} />
                </Label>
                <RadioGroupItem
                  value="2"
                  id="rating-2"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rating-2"
                  className="cursor-pointer"
                  onMouseLeave={() => handleLeave()}
                  onMouseEnter={() => handleHover(2)}
                  onClick={() => handleRatingChange(2)}
                  title="2 stars"
                >
                  <StarIcon className={`h-6 w-6 ${isFilled(2)}`} />
                </Label>
                <RadioGroupItem
                  value="3"
                  id="rating-3"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rating-3"
                  className="cursor-pointer"
                  onMouseLeave={() => handleLeave()}
                  onMouseEnter={() => handleHover(3)}
                  onClick={() => handleRatingChange(3)}
                  title="3 stars"
                >
                  <StarIcon className={`h-6 w-6 ${isFilled(3)}`} />
                </Label>
                <RadioGroupItem
                  value="4"
                  id="rating-4"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rating-4"
                  className="cursor-pointer"
                  onMouseLeave={() => handleLeave()}
                  onMouseEnter={() => handleHover(4)}
                  onClick={() => handleRatingChange(4)}
                  title="4 stars"
                >
                  <StarIcon className={`h-6 w-6 ${isFilled(4)}`} />
                </Label>
                <RadioGroupItem
                  value="5"
                  id="rating-5"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="rating-5"
                  className="cursor-pointer"
                  onMouseLeave={() => handleLeave()}
                  onMouseEnter={() => handleHover(5)}
                  onClick={() => handleRatingChange(5)}
                  title="5 stars"
                >
                  <StarIcon className={`h-6 w-6 ${isFilled(5)}`} />
                </Label>
              </RadioGroup>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
export default Page;
