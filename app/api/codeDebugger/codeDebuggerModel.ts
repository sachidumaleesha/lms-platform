const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API;

export async function debugCode(proLanguage: string, code: string) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    {
      text: "input: public class Test {\n\n    private static void printLength(String str) {\n        System.out.println(str.length());\n    }\n\n    public static void main(String []args){\n\n        String myString = null;\n        printLength(myString);\n    }\n}\n\nThe above code is not running. Could you tell me what the problem might be?",
    },
    {
      text: "output: The code will result in a 'NullPointerException' at runtime when you call the 'printLength' method with 'myString' variable, which is set to null.The 'NullPointerException' occurs because the 'length()' method is being called on a null object reference. To fix this issue, you can add a null check before calling the 'length()' method.Here is the updated code:\n\npublic class Test {\n\n    private static void printLength(String str) {\n        if (str != null) {\n            System.out.println(str.length());\n        } else {\n            System.out.println(\"String is null.\");\n        }\n    }\n\n    public static void main(String[] args) {\n        String myString = null;\n        printLength(myString);\n    }\n}\n\nThis code will check if 'myString' is null before calling the 'length()' method, and if it is null, it will print a message to the console.",
    },
    {
      text: "input: Could you tell me some test cases to test the above code?",
    },
    {
      text: 'output: Certainly! Here are some test cases you can use to test the \'printLength\' method:\n1. Test with a non-null string:String myString = "Hello";printLength(myString);//Expected Output: 52. Test with a null string:\nString myString = null;printLength(myString);//Expected Output: String is null3. Test with an empty string:String myString = "";printLength(myString);//Expected Output: 04. Test with a string containing whitespace characters:String myString = "   ";printLength(myString);//Expected Output: 35. Test with a string containing special characters:String myString = "Hello, World!";printLength(myString);//Expected Output: 13',
    },
    {
      text: 'input: Enter the code below containing a logical error and ask ChatGPT to check for reasons why the error is occurring.\n\npublic class Test {    public static void main(String[] args)    {        int num = 1234;        int reversednum = 0;        int remainder;        while (num != 0) {            remainder = num / 10;            reversednum = reversednum * 10 + remainder;            num /= 10;        }        System.out.println("The reversed number is " + reversednum);    }}\n\nWhy is my code for reversing a number giving a wrong output?',
    },
    {
      text: "output: Your code to reverse a number is giving wrong output because you are using integer division instead of modulo operator to get the remainder of the number.In the 'while' loop, you are using integer division to calculate the remainder:\nremainder = num / 10;This should actually be the modulo operator %:remainder = num % 10;The modulo operator returns the remainder of the division, which is what you need to get the last digit of the number. Using integer division will give you the quotient, which is not what you want.Here's the corrected code:\npublic class Test {\n    public static void main(String[] args)\n    {\n        int num = 1234;\n        int reversednum = 0;\n        int remainder;\n\n        while (num != 0) {\n            remainder = num % 10;\n            reversednum = reversednum * 10 + remainder;\n            num /= 10;\n        }\n        System.out.println(\"The reversed number is \" + reversednum);\n    }\n}\n\nWith this correction, the code should work correctly for all input numbers.",
    },
    {
      text: "input: Could you give me some test cases to test the above code?",
    },
    {
      text: "output: Sure, here are some test cases to test your code:1. Input: 1234, Output: 43212. Input: 987654321, Output: 1234567893. Input: 1001, Output: 10014. Input: 0, Output: 05. Input: 123, Output: 321You can try these inputs and verify that the output is correct.",
    },
    {
      text: 'input: mystr = "IronMan"num = 4print(mystr + num + mystr)Why is my code throwing TypeError?',
    },
    {
      text: "output: Your code is throwing a 'TypeError' because you are trying to concatenate a string (str) with an integer (num) using the + operator, which is not supported in Python.In Python, you can only concatenate strings with other strings using the + operator. If you want to concatenate a string with an integer, you need to convert the integer to a string first using the 'str()' function.Here's the corrected code:\nmystr = \"IronMan\"\nnum = 4\nprint(mystr + str(num) + mystr)In this code, 'str(num)' converts the integer num to a string, which can then be concatenated with the other strings using the + operator. The output of this code will be:IronMan4IronManNote that the integer 4 is now converted to a string and concatenated between the two instances of the string 'IronMan'.",
    },
    {
      text: `what is the problem with this ${proLanguage} code? Why is it not working as expected? and explain how you would have solved it? \n\n ${code}`,
    },
    { text: "output: " },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  return response.text();
}
