import logging
import os.path
import socket 

from flask import Flask
from logging.handlers import SysLogHandler
app = Flask(__name__)

class ContextFilter(logging.Filter):
    hostname = socket.gethostname()
    
    def filter(self, record):
        record.hostname = ContextFilter.hostname
        return True

def initialize_logger(logger, output_dir):

    logger.addFilter(ContextFilter())

    # create console handler and set level to info
    consolelog = logging.StreamHandler()
    consolelog.setLevel(logging.INFO)
    formatter = logging.Formatter("%(levelname)s - %(message)s")
    consolelog.setFormatter(formatter)
    logger.addHandler(consolelog)

    # Syslog handler
    syslog = SysLogHandler(address=('logs2.papertrailapp.com', 30280))
    formatter = logging.Formatter('%(asctime)s %(hostname)s %(levelname)s slots_spots_local %(message)s', datefmt='%Y-%m-%dT%H:%M:%S')
    syslog.setFormatter(formatter)
    logger.addHandler(syslog)

    # File handler
    filelog = logging.FileHandler(os.path.join(output_dir, "all.log"),"w", encoding=None, delay="true")
    filelog.setLevel(logging.DEBUG)
    formatter = logging.Formatter("%(levelname)s - %(message)s")
    filelog.setFormatter(formatter)
    logger.addHandler(filelog)
