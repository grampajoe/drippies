from pip.req import parse_requirements
from setuptools import setup


requirements = [
    str(requirement.req) for requirement in
    parse_requirements('requirements.txt')
]


setup(
    name='Drippies',
    version='0.0.0',
    description='Drippies, the weather app for idiot children.',
    author='Joe Friedl <joe@joefriedl.net>',
    pymodules=['drippies'],
    install_requires=requirements,
    tests_require=[
        'pytest',
    ],
    classifiers=[
        "Development Status :: 1 - Planning",
        "Environment :: Web Environment",
        "Intended Audience :: Other Audience",
        "License :: OSI Approved :: BSD License",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3.4",
        "Topic :: Artistic Software",
    ],
)
