import argparse
import sys
import os
import skimage.io
import numpy as np
import ntpath
from PIL import Image
from skimage.measure import find_contours
# Root directory of the project
ROOT_DIR = os.path.abspath("../")

# Import Mask RCNN
sys.path.append(ROOT_DIR)  # To find local version of the library
from Mask_RCNN.mrcnn import utils
import Mask_RCNN.mrcnn.model as modellib
import subprocess
from glob import glob

from scipy import misc
# Import COCO config
sys.path.append(os.path.join(ROOT_DIR, "code/Mask_RCNN/samples/coco/"))  # To find local version
import coco
from matplotlib.patches import Polygon

import tarfile
from six.moves import urllib

import tensorflow as tf

os.environ['CUDA_VISIBLE_DEVICES']='0'
use_gpu = True

# disable gpu if specified
config = tf.ConfigProto(device_count={'GPU': 0}) if use_gpu == "false" else None

def parse_args():
    """Parse input arguments."""
    parser = argparse.ArgumentParser(description='Human Segmentation')

    parser.add_argument('--videoInput', dest='videoInput', help='the video input',
                        default='')
    parser.add_argument('--outputDir', dest='outputDir', help='the directory of the outputs',
                        default='')
    parser.add_argument('--typeAlgorithm', dest='typeAlgorithm', help='the algorithm for segmentation',
                        default='')


    args = parser.parse_args()
    if len(sys.argv) == 1:
        parser.print_help()
        sys.exit()

    if not os.path.exists(args.videoInput):
        print('data is not exist!')
        sys.exit()

    if not os.path.exists(args.outputDir):
        print('folder is not exist!')
        sys.exit()
    elif not os.path.exists(os.path.join(args.outputDir, 'frames')):
        os.makedirs(os.path.join(args.outputDir, 'frames'))
        os.makedirs(os.path.join(args.outputDir, 'segmented_frames'))

    return args

args = parse_args()

def segment_human(path, orignal_im, idx):
    orignal_im = np.array(orignal_im)
    orignal_im[idx] = 0
    imga = Image.fromarray(orignal_im)
    imga = imga.convert('RGBA')
    misc.imsave(os.path.join(args.outputDir, 'segmented_frames', ntpath.basename(path)[:-4]+'.png'), imga)

extract_cmd = "ffmpeg -i '%s' '%s'/" % (args.videoInput,  os.path.join(args.outputDir, 'frames')) + "%06d.jpg"
output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read()

# Load a image from the images folder
img_paths = glob(os.path.join(args.outputDir, 'frames', '*.jpg'))

if args.typeAlgorithm=='maskrcnn':
    # Directory to save logs and trained model
    MODEL_DIR = os.path.join(ROOT_DIR, "logs")

    # Local path to trained weights file
    COCO_MODEL_PATH = os.path.join('models', "mask_rcnn_coco.h5")
    # Download COCO trained weights from Releases if needed
    if not os.path.exists(COCO_MODEL_PATH):
        utils.download_trained_weights(COCO_MODEL_PATH)

    # # Directory of images to run detection on
    # IMAGE_DIR = os.path.join(ROOT_DIR, "images")

    # ## Configurations
    #
    # We'll be using a model trained on the MS-COCO dataset. The configurations of this model are in the ```CocoConfig``` class in ```coco.py```.
    #
    # For inferencing, modify the configurations a bit to fit the task. To do so, sub-class the ```CocoConfig``` class and override the attributes you need to change.

    class InferenceConfig(coco.CocoConfig):
        # Set batch size to 1 since we'll be running inference on
        # one image at a time. Batch size = GPU_COUNT * IMAGES_PER_GPU
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1

    config = InferenceConfig()
    config.display()


    # ## Create Model and Load Trained Weights

    # Create model object in inference mode.
    model = modellib.MaskRCNN(mode="inference", model_dir=MODEL_DIR, config=config)

    # Load weights trained on MS-COCO
    model.load_weights(COCO_MODEL_PATH, by_name=True)

    # COCO Class names
    # Index of the class in the list is its ID. For example, to get ID of
    # the teddy bear class, use: class_names.index('teddy bear')
    class_names = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane',
                   'bus', 'train', 'truck', 'boat', 'traffic light',
                   'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird',
                   'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear',
                   'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie',
                   'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
                   'kite', 'baseball bat', 'baseball glove', 'skateboard',
                   'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
                   'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
                   'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
                   'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed',
                   'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
                   'keyboard', 'cell phone', 'microwave', 'oven', 'toaster',
                   'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
                   'teddy bear', 'hair drier', 'toothbrush']

    def get_segmap(seg_map, mask, label):
        idx = np.where(mask == 1)
        seg_map[idx]=label
        return seg_map

    for path in img_paths:
        image = skimage.io.imread(path)

        # Run detection
        results = model.detect([image], verbose=1)

        # Visualize results
        r = results[0]

        # Number of instances
        boxes = r['rois']
        masks = r['masks']
        class_ids = r['class_ids']
        scores = r['scores']
        N = boxes.shape[0]
        if not N:
            print("\n*** No instances to display *** \n")
        else:
            assert boxes.shape[0] == masks.shape[-1] == class_ids.shape[0]

        # Show area outside image boundaries.
        height, width = image.shape[:2]
        # masked_image = image.astype(np.uint32).copy()
        seg_map = np.zeros((image.shape[:2]))
        for i in range(N):
            # colors = colors or random_colors(N)
            class_id = class_ids[i]
            print(class_id)
            score = scores[i] if scores is not None else None
            label = class_names[class_id]
            mask = masks[:, :, i]
            seg_map = get_segmap(seg_map, mask, class_id)

        idx = np.where(seg_map != 1)
        segment_human(path, image, idx)

elif args.typeAlgorithm=='deeplabv3':
    class DeepLabModel(object):
        """Class to load deeplab model and run inference."""

        INPUT_TENSOR_NAME = 'ImageTensor:0'
        OUTPUT_TENSOR_NAME = 'SemanticPredictions:0'

        INPUT_SIZE = 513
        FROZEN_GRAPH_NAME = 'frozen_inference_graph'

        def __init__(self, tarball_path):
            """Creates and loads pretrained deeplab model."""
            self.graph = tf.Graph()

            graph_def = None
            # Extract frozen graph from tar archive.
            tar_file = tarfile.open(tarball_path)
            for tar_info in tar_file.getmembers():
                if self.FROZEN_GRAPH_NAME in os.path.basename(tar_info.name):
                    file_handle = tar_file.extractfile(tar_info)
                    graph_def = tf.GraphDef.FromString(file_handle.read())
                    break

            tar_file.close()

            if graph_def is None:
                raise RuntimeError('Cannot find inference graph in tar archive.')

            with self.graph.as_default():
                tf.import_graph_def(graph_def, name='')

            self.sess = tf.Session(graph=self.graph)

        def run(self, image):
            """Runs inference on a single image.

            Args:
              image: A PIL.Image object, raw input image.

            Returns:
              resized_image: RGB image resized from original input image.
              seg_map: Segmentation map of `resized_image`.
            """

            width, height = image.size

            resize_ratio = 1.0 * self.INPUT_SIZE / max(width, height)
            target_size = (int(resize_ratio * width), int(resize_ratio * height))
            resized_image = image.convert('RGB').resize(target_size, Image.ANTIALIAS)
            batch_seg_map = self.sess.run(
                self.OUTPUT_TENSOR_NAME,
                feed_dict={self.INPUT_TENSOR_NAME: [np.asarray(resized_image)]})
            seg_map = batch_seg_map[0]

            g = tf.Graph()
            with g.as_default():
                new_input = tf.placeholder(tf.float32, shape=(1, seg_map.shape[0], seg_map.shape[1], 1))
                print(new_input.get_shape())
                raw_output = tf.image.resize_bilinear(new_input, [height, width])
                raw_output = tf.cast(raw_output, tf.uint8)

            sess1 = tf.Session(graph=g)

            seg_map = np.expand_dims(seg_map, axis=0)
            seg_map = np.expand_dims(seg_map, axis=3)

            new_seg_map = sess1.run(raw_output, feed_dict={new_input: seg_map})
            new_seg_map = np.squeeze(new_seg_map, axis=[0, 3])

            return resized_image, new_seg_map


    LABEL_NAMES = np.asarray([
        'background', 'aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus',
        'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike',
        'person', 'pottedplant', 'sheep', 'sofa', 'train', 'tv'
    ])

    FULL_LABEL_MAP = np.arange(len(LABEL_NAMES)).reshape(len(LABEL_NAMES), 1)

    # @title Select and download models {display-mode: "form"}

    MODEL_NAME = 'xception_coco_voctrainaug'
    # @param ['mobilenetv2_coco_voctrainaug', 'mobilenetv2_coco_voctrainval', 'xception_coco_voctrainaug', 'xception_coco_voctrainval']

    _DOWNLOAD_URL_PREFIX = 'http://download.tensorflow.org/models/'
    _MODEL_URLS = {
        'mobilenetv2_coco_voctrainaug':
            'deeplabv3_mnv2_pascal_train_aug_2018_01_29.tar.gz',
        'mobilenetv2_coco_voctrainval':
            'deeplabv3_mnv2_pascal_trainval_2018_01_29.tar.gz',
        'xception_coco_voctrainaug':
            'deeplabv3_pascal_train_aug_2018_01_04.tar.gz',
        'xception_coco_voctrainval':
            'deeplabv3_pascal_trainval_2018_01_04.tar.gz',
    }
    _TARBALL_NAME = _MODEL_URLS[MODEL_NAME]  # 'deeplab_model.tar.gz'

    download_path = os.path.join('./models', _TARBALL_NAME)

    if not os.path.isfile(download_path):
        print('downloading model, this might take a while...')
        urllib.request.urlretrieve(_DOWNLOAD_URL_PREFIX + _MODEL_URLS[MODEL_NAME],
                                   download_path)
        print('download completed! loading DeepLab model...')

    MODEL = DeepLabModel(download_path)
    print('model loaded successfully!')

    # Note that we are using single scale inference in the demo for fast
    # computation, so the results may slightly differ from the visualizations
    # in README, which uses multi-scale and left-right flipped inputs.
    import time


    def run_demo_image(image_name):
        try:
            image_path = os.path.join(image_name)
            orignal_im = Image.open(image_path)
        except IOError:
            print('Failed to read image from %s.' % image_path)
            return
        print('running deeplab on image %s...' % image_name)
        st = time.time()
        resized_im, seg_map = MODEL.run(orignal_im)

        # vis_segmentation(resized_im, seg_map)
        et = time.time() - st
        # print(et*1000)
        return orignal_im, resized_im, seg_map

    for path in img_paths:
        print(path)
        orignal_im, resized_im, seg_map = run_demo_image(path)
        h, w, _ = np.array(orignal_im).shape
        print(np.array(seg_map).shape)

        idx = np.where(seg_map != 15)
        segment_human(path, orignal_im, idx)


extract_cmd = "ffmpeg -i '%s' -pix_fmt yuv420p '%s'" % (os.path.join(args.outputDir, 'segmented_frames')+ '/%06d.png'
                                                     ,os.path.join(args.outputDir, ntpath.basename(args.videoInput)[:-4]+'.MOV'))
output = subprocess.Popen(extract_cmd, shell=True, stdout=subprocess.PIPE).stdout.read()


