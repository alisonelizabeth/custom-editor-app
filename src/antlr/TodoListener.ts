// Generated from ./src/antlr/Todo.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { TodoExpressionsContext } from "./TodoParser";
import { AddExpressionContext } from "./TodoParser";
import { DeleteExpressionContext } from "./TodoParser";
import { CompleteExpressionContext } from "./TodoParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `TodoParser`.
 */
export interface TodoListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `TodoParser.todoExpressions`.
	 * @param ctx the parse tree
	 */
	enterTodoExpressions?: (ctx: TodoExpressionsContext) => void;
	/**
	 * Exit a parse tree produced by `TodoParser.todoExpressions`.
	 * @param ctx the parse tree
	 */
	exitTodoExpressions?: (ctx: TodoExpressionsContext) => void;

	/**
	 * Enter a parse tree produced by `TodoParser.addExpression`.
	 * @param ctx the parse tree
	 */
	enterAddExpression?: (ctx: AddExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TodoParser.addExpression`.
	 * @param ctx the parse tree
	 */
	exitAddExpression?: (ctx: AddExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TodoParser.deleteExpression`.
	 * @param ctx the parse tree
	 */
	enterDeleteExpression?: (ctx: DeleteExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TodoParser.deleteExpression`.
	 * @param ctx the parse tree
	 */
	exitDeleteExpression?: (ctx: DeleteExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TodoParser.completeExpression`.
	 * @param ctx the parse tree
	 */
	enterCompleteExpression?: (ctx: CompleteExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TodoParser.completeExpression`.
	 * @param ctx the parse tree
	 */
	exitCompleteExpression?: (ctx: CompleteExpressionContext) => void;
}

