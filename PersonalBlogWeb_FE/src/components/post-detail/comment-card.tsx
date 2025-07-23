import Image from "next/image";
import {
  Typography,
  Card,
  CardBody,
  Button
} from "@material-tailwind/react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";


interface CommentCardProps {
  img: string;
  name: string;
  desc: string;
  hours?: string;
  likeCount?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onReply?: () => void;
  isReply?: boolean;
}

export function CommentCard({ 
  img, 
  name, 
  desc, 
  hours, 
  likeCount = 0, 
  isLiked = false, 
  onLike, 
  onReply, 
  isReply = false 
}: Readonly<CommentCardProps>) {
  return (
    <Card
      shadow={false}
      color="transparent"
      className="grid items-center gap-6 "
    >
      <CardBody className="p-0 gap-5 flex ">
        <div className=" !m-0 h-full  w-full  max-h-[40px] max-w-[40px] ">
          <Image
            width={768}
            height={768}
            src={img}
            alt="img"
            className="h-full rounded w-full object-cover object-center"
          />
        </div>
        <div>
          <div className="flex gap-1 mb-3 items-center">
            <Typography
              variant="small"
              className=" font-bold flex items-center gap-2 !text-gray-900"
            >
              {name}
            </Typography>
            {hours && (
              <Typography variant="small" color="gray" className="font-normal">
                {hours}
              </Typography>
            )}
          </div>
          <Typography className="w-full font-normal mb-4 !text-gray-500">
            {desc}
          </Typography>
          <div className="!w-full flex justify-end">
            <div className="flex items-center gap-2">
              {!isReply && (
                <Button
                  size="sm"
                  variant="text"
                  color="gray"
                  className="flex items-center gap-1 flex-shrink-0"
                  onClick={onReply}
                >
                  <ArrowUturnLeftIcon className="w-4 text-4 h-4" />
                  Reply
                </Button>
              )}
              <Button
                size="sm"
                variant="text"
                className={`flex items-center gap-1 flex-shrink-0 ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                }`}
                onClick={onLike}
              >
                <HeartIcon className={`w-4 h-4 ${isLiked ? 'text-red-500' : ''}`} />
                {likeCount > 0 ? `${likeCount} Like${likeCount > 1 ? 's' : ''}` : 'Like'}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

  export default CommentCard;