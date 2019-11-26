# Requires "requests" to be installed (see python-requests.org)
import requests
import sys

######################python3 remove_bg.py input.jpg output.png

def main():
    if (len(sys.argv) != 3):
        print('usage: ', sys.argv[0], 'input.jpg, output.png')
        return

    response = requests.post(
	    'https://api.remove.bg/v1.0/removebg',
	    #data={
		#'image_url': 'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/feilvbin2.jpg',
		#'size': 'auto'
	    #},
	    files={'image_file': open(sys.argv[1], 'rb')},
	    data={'size': 'auto'},
	    headers={'X-Api-Key': 'ekZTeLiGE1Z7wbyUWQ1D68b9'}
   )
   
    if response.status_code == requests.codes.ok:
        with open(sys.argv[2], 'wb') as out:
             out.write(response.content)
             return
    else:
       print("Error:", response.status_code, response.text)
       return

if __name__ == "__main__":
    main()
    sys.exit()
