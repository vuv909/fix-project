import React, { useEffect, useState } from "react";
import avatar from "../../assets/logo.png";
import { Avatar } from "primereact/avatar";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { useSelector } from "react-redux";
import { ACCEPT, REJECT, SUCCESS, formatDate, isLoggedIn } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const commentsData = [
  {
    user: { avatar: avatar, name: "John Doe" },
    createdAt: new Date().toISOString(),
    rating: 4,
    content: "This is a great product!",
  },
  {
    user: { avatar: avatar, name: "Jane Smith" },
    createdAt: new Date().toISOString(),
    rating: 5,
    content: "Absolutely love this!",
  },
  // Add more comments as needed
];

export default function Comment({
  documentId,
  toast,
  listCommentByUser,
  fetDocumentByUser,
}) {
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(null);
  const [updateCommentState, setUpdateCommentState] = useState("");
  const user = useSelector((state) => state.user.value);
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatedComment, setUpdatedComment] = useState({});
  const [updateRating, setUpdateRating] = useState(null);
  const [visibleDelete, setVisibleDelete] = useState(false);

  useEffect(() => {
    fetchComment();
  }, [user]);

  const fetchComment = () => {
    if (user && user.sub) {
      restClient({
        url:
          `api/commentdocument/getallcommentbydocumentidpagination?documentId=` +
          documentId,
        method: "GET",
      })
        .then((res) => {
          const filteredData = res.data.data.filter(
            (r) => r.userId !== user.sub
          );
          setCommentList(filteredData);
        })
        .catch((err) => {
          setCommentList([]);
        });
    } else {
      restClient({
        url:
          `api/commentdocument/getallcommentbydocumentidpagination?documentId=` +
          documentId,
        method: "GET",
      })
        .then((res) => {
          setCommentList(res.data.data);
        })
        .catch((err) => {
          setCommentList([]);
        });
    }
  };

  const comment = () => {
    console.log("comment::", newComment);
    console.log("rating::", newRating);
    if (!newComment || (typeof newComment === "string" && !newComment.trim())) {
      REJECT(toast, "Vui lòng không để trống ô bình luận");
    }
    if (!newRating) {
      REJECT(toast, "Vui lòng chọn điểm đánh giá");
    }
    if (
      newComment &&
      newRating &&
      typeof newComment === "string" &&
      newComment.trim()
    ) {
      const data = {
        note: newComment,
        rating: newRating,
        documentId,
        userId: user?.sub,
      };
      restClient({
        url: "api/commentdocument/createcommentdocument",
        method: "POST",
        data,
      })
        .then((res) => {
          setNewComment("");
          setNewRating(null);
          SUCCESS(toast, "Thêm đánh giá thành công");
          fetchComment();
          fetDocumentByUser();
        })
        .catch((err) => {
          REJECT(toast, "Xảy ra lỗi khi thêm đánh giá");
        });
    }
  };

  const updateComment = () => {
    console.log("comment::", updateCommentState);
    console.log("rating::", updateRating);
    if (
      !updateCommentState ||
      (typeof updateCommentState === "string" && !updateCommentState.trim())
    ) {
      REJECT(toast, "Vui lòng không để trống ô bình luận");
    }
    if (!updateRating) {
      REJECT(toast, "Vui lòng chọn điểm đánh giá");
    }
    if (
      updateCommentState &&
      updateRating &&
      typeof updateCommentState === "string" &&
      updateCommentState.trim()
    ) {
      const data = {
        id: updatedComment.id,
        note: updateCommentState,
        rating: updateRating,
        documentId,
        userId: user?.sub,
      };
      restClient({
        url: "api/commentdocument/updatecommentdocument",
        method: "PUT",
        data,
      })
        .then((res) => {
          setUpdateCommentState("");
          setUpdateRating(null);
          setUpdatedComment({});
          SUCCESS(toast, "Thêm đánh giá thành công");
          fetchComment();
          fetDocumentByUser();
        })
        .catch((err) => {
          REJECT(toast, "Xảy ra lỗi khi thêm đánh giá");
        });
    }
  };

  const confirmDelete = (id) => {
    setVisibleDelete(true);
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa bình luận này?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      footer: (
        <>
          <Button
            label="Hủy"
            icon="pi pi-times"
            className="p-2 bg-red-500 text-white mr-2"
            onClick={() => {
              setVisibleDelete(false);
            }}
          />
          <Button
            label="Xóa"
            icon="pi pi-check"
            className="p-2 bg-blue-500 text-white"
            onClick={() => {
              deleteDocument(id);
            }}
          />
        </>
      ),
    });
  };

  const deleteDocument = (id) => {
    restClient({
      url: "api/commentdocument/deletecommentdocument/" + id,
      method: "DELETE",
    })
      .then(() => {
        fetchComment();
        fetDocumentByUser();
        ACCEPT(toast, "Xóa thành công");
        setVisibleDelete(false);
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi xóa");
      });
  };

  return (
    <div>
      <div className="py-20">
        <ConfirmDialog visible={visibleDelete} />
        <hr />
        <h1 className="font-bold text-center mt-5">Phần đánh giá</h1>
        {/* Comment Editor */}

        {listCommentByUser.length === 0 && isLoggedIn() && (
          <div className="mt-2 border border-solid border-gray-300 p-4 rounded-xl">
            <h2 className="font-bold mb-4">
              Nhập đánh giá của bạn về bộ tài liệu này
            </h2>
            <Rating
              value={newRating}
              onChange={(e) => setNewRating(e.value)}
              stars={5}
              className="mb-4"
            />
            <textarea
              className="w-full h-20 border border-gray-400sadf"
              defaultValue={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              label="Gửi"
              icon="pi pi-send"
              className="bg-blue-600 p-2 text-white 
        "
              onClick={comment}
            />
          </div>
        )}

        {updatedComment && Object.keys(updatedComment).length > 0 && (
          <div className="mt-2 border border-solid border-gray-300 p-4 rounded-xl">
            <h2 className="font-bold mb-4">
              Cập nhật đánh giá của bạn về bộ tài liệu này
            </h2>
            <Rating
              value={updateRating}
              onChange={(e) => setUpdateRating(e.value)}
              stars={5}
              className="mb-4"
            />
            <textarea
              className="w-full h-20 border border-gray-400sadf"
              defaultValue={updateCommentState}
              onChange={(e) => setUpdateCommentState(e.target.value)}
            />
            <Button
              label="Gửi"
              icon="pi pi-send"
              className="bg-blue-600 p-2 text-white 
        "
              onClick={updateComment}
            />
            <Button
              label="Hủy"
              icon="pi pi-times"
              className="bg-red-600 p-2 ml-2 text-white 
        "
              onClick={() => setUpdatedComment({})}
            />
          </div>
        )}

        {/* Comments Of User */}
        <div className="mt-10">
          <>
            {listCommentByUser &&
              updatedComment &&
              Object.keys(updatedComment).length === 0 &&
              listCommentByUser.map((comment, index) => (
                <>
                  <div className="my-5">
                    <div className="flex gap-5 items-center" key={index}>
                      <div>
                        <img
                          src={comment?.avatar}
                          className="border border-gray-300 rounded-full h-16 w-16"
                        />
                      </div>
                      <div className="border border-solid border-gray-300 p-4 rounded-xl flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-bold">{comment.fullName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="14"
                                viewBox="0 0 448 512"
                              >
                                <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                              </svg>
                              {/* &nbsp;{new Date(comment.createdAt).toLocaleString()} */}
                              {comment.lastModifiedDate
                                ? "Cập nhật lúc " +
                                  formatDate(comment.lastModifiedDate)
                                : formatDate(comment?.createdDate)}
                            </p>
                          </div>
                        </div>
                        <div className="my-2">
                          <Rating
                            value={comment?.rating || 0}
                            readOnly
                            stars={5}
                            cancel={false}
                            className="shadow-none"
                          />
                        </div>
                        <div>
                          <p>{comment?.note}</p>
                        </div>
                      </div>
                      {/* Edit and Delete Buttons */}
                    </div>
                    <div className="flex justify-end gap-5">
                      <div>
                        <Button
                          label="Edit"
                          className="p-button-success p-button-outlined bg-green-500 text-white p-1"
                          icon="pi pi-pencil"
                          onClick={() => {
                            setUpdatedComment(comment);
                            setUpdateRating(comment.rating);
                            setUpdateCommentState(comment.note);
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          label="Delete"
                          className="p-button-danger p-button-outlined bg-red-500 text-white p-1"
                          icon="pi pi-trash"
                          onClick={() => confirmDelete(comment.id)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </>
        </div>

        {/* Comments List */}
        <div className="mt-10">
          {loading ? (
            <Loading />
          ) : (
            <>
              {commentList &&
                commentList.map((comment, index) => (
                  <div className="flex gap-5 items-center mt-5" key={index}>
                    <div>
                      <img
                        src={comment.avatar}
                        className="border border-gray-300 rounded-full h-16 w-16"
                      />
                    </div>
                    <div className="border border-solid border-gray-300 p-4 rounded-xl flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-bold">{comment.fullName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="14"
                              viewBox="0 0 448 512"
                            >
                              <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                            </svg>
                            {/* &nbsp;{new Date(comment.createdAt).toLocaleString()} */}
                            {comment.lastModifiedDate
                                ? "Cập nhật lúc " +
                                  formatDate(comment.lastModifiedDate)
                                : formatDate(comment?.createdDate)}
                          </p>
                        </div>
                      </div>
                      <div className="my-2">
                        <Rating
                          value={comment?.rating || 0}
                          readOnly
                          stars={5}
                          cancel={false}
                          className="shadow-none"
                        />
                      </div>
                      <div>
                        <p>{comment?.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
