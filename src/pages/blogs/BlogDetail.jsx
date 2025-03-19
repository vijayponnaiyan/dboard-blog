import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogsById, deleteBlogs } from "../../api/blogs";
import Loader from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import { GoThumbsdown, GoThumbsup } from "react-icons/go";
import { RiShareForwardFill } from "react-icons/ri";
import { FaRegCommentDots } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import Forms from "../../pages/blogs/components/Forms";
import DeleteModal from "../../components/Modal/DeleteModal";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isshow, Setisshow] = useState(false);
  const [Deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const data = await blogsById(id);
        if (!data) throw new Error("No data returned from the API.");
        setBlog(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlogs(id);
      toast.success("User deleted successfully.");
      navigate("/blogs");
    } catch (err) {
      toast.error("Failed to delete the user. Please try again.");
      console.error("Error deleting user:", err.message);
    } finally {
      setDeleting(false);
      Setisshow(false);
    }
  };

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModal(true);
  };
  const closeModal = () => {
    setIsModal(false);
  };

  const deleteModal = () => {
    Setisshow(true);
  };
  const deletclose = () => {
    Setisshow(false);
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorState errorMessage={error.message} />;
  if (!blog)
    return <p className="text-center text-gray-500">No posts found.</p>;

  const { author, content, title, createdAt, categories, tags, status } = blog;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-6 border border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-blue-600 mb-4"
        >
          <IoArrowBack className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-4 border-b pb-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {author || "Unknown Author"}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {title || "Untitled Post"}
        </h1>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          {content || "No content available."}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Categories:</strong> {categories?.join(", ") || "None"}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Tags:</strong> {tags?.join(", ") || "None"}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Status:</strong> {status || "N/A"}
        </p>
        <div className="flex justify-between border-t pt-4 text-gray-600">
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
            <GoThumbsup className="w-5 h-5" />
            <span>Like</span>
          </button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition">
            <GoThumbsdown className="w-5 h-5" />
            <span>Dislike</span>
          </button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <FaRegCommentDots className="w-5 h-5" />
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition">
            <RiShareForwardFill className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button
            onClick={() => openModal(blog)}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <CiMenuKebab className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button
            onClick={deleteModal}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <MdOutlineDelete className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {isModal && (
        <Forms isOpen={isModal} onCancel={closeModal} blog={selectedBlog} />
      )}

      {isshow && (
        <DeleteModal
          title="Are you sure you want to delete this Blogs?"
          onCancel={deletclose}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
